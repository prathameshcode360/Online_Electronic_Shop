import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../middleware/validate.middleware.js";
import upload from "../middleware/upload.middleware.js";

import {
  createProductSchema,
  updateProductSchema,
} from "../validations/product.validation.js";

const productRouter = express.Router();

// ==================== Public Routes ====================

productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);

// ==================== Admin Routes ====================

// Create Product
productRouter.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.array("images", 5),
  validate(createProductSchema),
  createProduct,
);

// Update Product
productRouter.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.array("images", 5),
  validate(updateProductSchema),
  updateProduct,
);

// Delete Product
productRouter.delete("/:id", authenticate, authorize("admin"), deleteProduct);

export default productRouter;
