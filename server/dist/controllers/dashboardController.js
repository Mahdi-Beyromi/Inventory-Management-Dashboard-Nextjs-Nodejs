import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
export const getDashboardMetrics = async (req, res) => {
    try {
        // Get total products
        const totalProducts = await prisma.products.count();
        // Get total orders
        const totalOrders = await prisma.order.count();
        // Get total revenue
        const revenueResult = await prisma.order.aggregate({
            _sum: {
                totalPrice: true,
            },
        });
        const totalRevenue = revenueResult._sum.totalPrice || 0;
        // Get popular products (top 5 by order count)
        const popularProducts = await prisma.order.groupBy({
            by: ['productId'],
            _count: {
                productId: true,
            },
            orderBy: {
                _count: {
                    productId: 'desc',
                },
            },
            take: 5,
        });
        // Get product details for popular products
        const popularProductsWithDetails = await Promise.all(popularProducts.map(async (product) => {
            const productDetails = await prisma.products.findUnique({
                where: { productId: product.productId },
                select: { name: true, price: true, category: true },
            });
            return {
                productId: product.productId,
                name: productDetails?.name || 'Unknown Product',
                price: productDetails?.price || 0,
                category: productDetails?.category || 'Unknown',
                orderCount: product._count.productId,
            };
        }));
        res.json({
            totalProducts,
            totalOrders,
            totalRevenue,
            popularProducts: popularProductsWithDetails,
        });
    }
    catch (error) {
        console.error('Error retrieving dashboard metrics:', error);
        res.status(500).json({ message: "Error retrieving dashboard metrics" });
    }
};
export const getSalesReport = async (req, res) => {
    try {
        // Get total orders and revenue
        const [totalOrders, revenueResult] = await Promise.all([
            prisma.order.count(),
            prisma.order.aggregate({
                _sum: {
                    totalPrice: true,
                },
            }),
        ]);
        const totalRevenue = revenueResult._sum.totalPrice || 0;
        // Get daily sales for the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const dailySales = await prisma.order.groupBy({
            by: ['createdAt'],
            _sum: {
                totalPrice: true,
            },
            where: {
                createdAt: {
                    gte: thirtyDaysAgo,
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        // Format daily sales data
        const formattedDailySales = dailySales.map((day) => ({
            date: day.createdAt.toISOString().split('T')[0], // YYYY-MM-DD format
            totalAmount: day._sum.totalPrice || 0,
        }));
        // Fill in missing dates with 0 values
        const filledDailySales = [];
        for (let i = 0; i < 30; i++) {
            const date = new Date(thirtyDaysAgo);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const existingDay = formattedDailySales.find(day => day.date === dateStr);
            filledDailySales.push({
                date: dateStr,
                totalAmount: existingDay ? existingDay.totalAmount : 0,
            });
        }
        res.json({
            totalOrders,
            totalRevenue,
            dailySales: filledDailySales,
        });
    }
    catch (error) {
        console.error('Error retrieving sales report:', error);
        res.status(500).json({ message: "Error retrieving sales report" });
    }
};
export const getLowInventoryReport = async (req, res) => {
    try {
        // Get products with stock quantity less than 10
        const lowInventoryProducts = await prisma.products.findMany({
            where: {
                stockQuantity: {
                    lt: 10,
                },
            },
            select: {
                productId: true,
                name: true,
                stockQuantity: true,
                category: true,
                price: true,
            },
            orderBy: {
                stockQuantity: 'asc', // Show lowest stock first
            },
        });
        res.json(lowInventoryProducts);
    }
    catch (error) {
        console.error('Error retrieving low inventory report:', error);
        res.status(500).json({ message: "Error retrieving low inventory report" });
    }
};
//# sourceMappingURL=dashboardController.js.map