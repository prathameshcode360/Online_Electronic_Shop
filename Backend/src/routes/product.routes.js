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
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/product.validation.js";

const productRouter = express.Router();

// Public Routes
productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);

// Admin Routes
productRouter.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createProductSchema),
  createProduct,
);

productRouter.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateProductSchema),
  updateProduct,
);

productRouter.delete("/:id", authenticate, authorize("admin"), deleteProduct);

export default productRouter;
