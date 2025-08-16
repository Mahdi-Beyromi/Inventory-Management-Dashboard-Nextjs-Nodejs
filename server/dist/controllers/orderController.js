import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
export const getOrders = async (req, res) => {
    try {
        const { search, status, page = '1', limit = '50' } = req.query;
        // Build where clause for filtering
        const where = {};
        // Status filter
        if (status && status !== 'all') {
            where.status = status;
        }
        // Search filter (search in orderId, product name, and category)
        if (search) {
            where.OR = [
                {
                    orderId: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    product: {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    product: {
                        category: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                },
            ];
        }
        // Pagination
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 50;
        const skip = (pageNum - 1) * limitNum;
        // Get total count for pagination
        const totalCount = await prisma.order.count({ where });
        // Get orders with filters and pagination
        const orders = await prisma.order.findMany({
            where,
            include: {
                product: {
                    select: {
                        name: true,
                        price: true,
                        category: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take: limitNum,
        });
        // Calculate pagination info
        const totalPages = Math.ceil(totalCount / limitNum);
        const hasNextPage = pageNum < totalPages;
        const hasPrevPage = pageNum > 1;
        res.json({
            orders,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalCount,
                hasNextPage,
                hasPrevPage,
                limit: limitNum,
            },
        });
    }
    catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({ message: "Error retrieving orders" });
    }
};
export const createOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        // Validate input
        if (!productId || !quantity || quantity <= 0) {
            res.status(400).json({
                message: "Product ID and quantity are required. Quantity must be positive."
            });
            return;
        }
        // Get product details
        const product = await prisma.products.findUnique({
            where: { productId },
        });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        // Check if enough stock is available
        if (product.stockQuantity < quantity) {
            res.status(400).json({
                message: `Insufficient stock. Available: ${product.stockQuantity}, Requested: ${quantity}`
            });
            return;
        }
        // Calculate total price
        const totalPrice = product.price * quantity;
        // Use transaction to ensure data consistency
        const result = await prisma.$transaction(async (tx) => {
            // Create the order
            const order = await tx.order.create({
                data: {
                    productId,
                    quantity,
                    totalPrice,
                    status: "pending", // Default status
                },
                include: {
                    product: {
                        select: {
                            name: true,
                            price: true,
                            category: true,
                        },
                    },
                },
            });
            // Update product stock
            await tx.products.update({
                where: { productId },
                data: {
                    stockQuantity: {
                        decrement: quantity,
                    },
                },
            });
            return order;
        });
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: "Error creating order" });
    }
};
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        // Validate orderId
        if (!orderId) {
            res.status(400).json({ message: "Order ID is required" });
            return;
        }
        // Validate status
        const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            res.status(400).json({
                message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
            });
            return;
        }
        // Update order status
        const updatedOrder = await prisma.order.update({
            where: { orderId: orderId },
            data: { status: status },
            include: {
                product: {
                    select: {
                        name: true,
                        price: true,
                        category: true,
                    },
                },
            },
        });
        res.json(updatedOrder);
    }
    catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: "Error updating order status" });
    }
};
//# sourceMappingURL=orderController.js.map