import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
export const getOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
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
        });
        res.json(orders);
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
//# sourceMappingURL=orderController.js.map