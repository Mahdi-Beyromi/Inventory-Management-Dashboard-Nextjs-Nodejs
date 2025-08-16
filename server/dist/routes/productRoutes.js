import { Router } from "express";
import { createProduct, getProducts } from "../controllers/productController.js";
const router = Router();
router.get("/", getProducts);
router.post("/", createProduct);
export default router;
//# sourceMappingURL=productRoutes.js.map