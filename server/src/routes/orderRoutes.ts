import { Router } from "express";
import { createOrder, getOrders, updateOrderStatus } from "../controllers/orderController.js";

const router = Router();

router.get("/", getOrders);
router.post("/", createOrder);
router.put("/:orderId/status", updateOrderStatus);

export default router;
