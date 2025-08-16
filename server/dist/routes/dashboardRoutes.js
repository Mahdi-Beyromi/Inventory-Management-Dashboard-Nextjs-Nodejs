import { Router } from "express";
import { getDashboardMetrics, getSalesReport, getLowInventoryReport } from "../controllers/dashboardController.js";
const router = Router();
router.get("/", getDashboardMetrics);
router.get("/sales-report", getSalesReport);
router.get("/low-inventory", getLowInventoryReport);
export default router;
//# sourceMappingURL=dashboardRoutes.js.map