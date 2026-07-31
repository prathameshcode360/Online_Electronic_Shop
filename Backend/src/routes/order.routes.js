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
import validate from "../middleware/validation.middleware.js";

import {
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
} from "../validations/order.validation.js";

const orderRouter = express.Router();

// Customer Routes

// Create a new order
orderRouter.post("/", authenticate, validate(createOrderSchema), createOrder);

// Get logged-in user's orders
orderRouter.get("/", authenticate, getMyOrders);

// Admin Routes

// Get all orders

orderRouter.get("/all", authenticate, authorize("admin"), getAllOrders);

// Update order status
orderRouter.put(
  "/:orderId/status",
  authenticate,
  authorize("admin"),
  validate(updateOrderStatusSchema),
  updateOrderStatus,
);

// Update payment status
orderRouter.put(
  "/:orderId/payment-status",
  authenticate,
  authorize("admin"),
  validate(updatePaymentStatusSchema),
  updatePaymentStatus,
);

// Shared Routes

orderRouter.get("/:orderId", authenticate, getOrderById);

export default orderRouter;
