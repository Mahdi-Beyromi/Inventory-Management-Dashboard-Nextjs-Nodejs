import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
export const getProducts = async (req, res) => {
    try {
        const search = req.query.search?.toString();
        const category = req.query.category?.toString();
        const whereClause = {};
        if (search) {
            whereClause.OR = [
                { name: { contains: search } },
                { category: { contains: search } }
            ];
        }
        if (category) {
            whereClause.category = category;
        }
        const products = await prisma.products.findMany({
            where: whereClause,
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving products" });
    }
};
export const createProduct = async (req, res) => {
    try {
        const { productId, name, price, rating, stockQuantity, category } = req.body;
        const product = await prisma.products.create({
            data: {
                productId,
                name,
                price,
                rating,
                stockQuantity,
                category,
            },
        });
        res.status(201).json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating product" });
    }
};
//# sourceMappingURL=productController.js.map