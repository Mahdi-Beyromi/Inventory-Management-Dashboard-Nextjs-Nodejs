import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
export const getDashboardMetrics = async (req, res) => {
    try {
        const popularProducts = await prisma.products.findMany({
            take: 15,
            orderBy: {
                stockQuantity: "desc",
            },
        });
        res.json({
            popularProducts,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving dashboard metrics" });
    }
};
//# sourceMappingURL=dashboardController.js.map