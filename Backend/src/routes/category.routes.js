import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../middleware/validate.middleware.js";
import upload from "../middleware/upload.middleware.js";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.validation.js";

const categoryRouter = express.Router();

// ==================== Public Routes ====================

categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategoryById);

// ==================== Admin Routes ====================

// Create Category
categoryRouter.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  validate(createCategorySchema),
  createCategory,
);

// Update Category
categoryRouter.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  validate(updateCategorySchema),
  updateCategory,
);

// Delete Category
categoryRouter.delete("/:id", authenticate, authorize("admin"), deleteCategory);

export default categoryRouter;
