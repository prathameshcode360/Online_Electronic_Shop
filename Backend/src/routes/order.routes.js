import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/order.controller.js";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
} from "../validations/order.validation.js";

const orderRouter = express.Router();

// Customer Routes
orderRouter.post("/", authenticate, validate(createOrderSchema), createOrder);

orderRouter.get("/", authenticate, getMyOrders);

orderRouter.get("/:orderId", authenticate, getOrderById);

// Admin Routes
orderRouter.get("/all", authenticate, authorize("admin"), getAllOrders);

orderRouter.put(
  "/:orderId/status",
  authenticate,
  authorize("admin"),
  validate(updateOrderStatusSchema),
  updateOrderStatus,
);

orderRouter.put(
  "/:orderId/payment-status",
  authenticate,
  authorize("admin"),
  validate(updatePaymentStatusSchema),
  updatePaymentStatus,
);

export default orderRouter;
