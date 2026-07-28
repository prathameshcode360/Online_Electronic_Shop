import express from "express";
import {
  getDashboardStats,
  getLowStockProducts,
  getRecentOrders,
  getSalesAnalytics,
  getTopSellingProducts,
  getTopSellingCategories,
  getTopCustomers,
  getOrderStatusAnalytics,
  getRevenueOverview,
} from "../controllers/admin.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

const adminRouter = express.Router();

// Admin Routes

// Dashboard
adminRouter.get(
  "/dashboard",
  authenticate,
  authorize("admin"),
  getDashboardStats,
);

// Orders
adminRouter.get(
  "/recent-orders",
  authenticate,
  authorize("admin"),
  getRecentOrders,
);

adminRouter.get(
  "/order-status-analytics",
  authenticate,
  authorize("admin"),
  getOrderStatusAnalytics,
);

// Products
adminRouter.get(
  "/low-stock-products",
  authenticate,
  authorize("admin"),
  getLowStockProducts,
);

adminRouter.get(
  "/top-selling-products",
  authenticate,
  authorize("admin"),
  getTopSellingProducts,
);

adminRouter.get(
  "/top-selling-categories",
  authenticate,
  authorize("admin"),
  getTopSellingCategories,
);

// Analytics
adminRouter.get(
  "/sales-analytics",
  authenticate,
  authorize("admin"),
  getSalesAnalytics,
);

adminRouter.get(
  "/revenue-overview",
  authenticate,
  authorize("admin"),
  getRevenueOverview,
);

// Customers
adminRouter.get(
  "/top-customers",
  authenticate,
  authorize("admin"),
  getTopCustomers,
);

export default adminRouter;
