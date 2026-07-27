import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import validate from "../middleware/validate.middleware.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.validation.js";

const categoryRouter = express.Router();

// Public Routes
categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategoryById);

// Admin Routes
categoryRouter.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createCategorySchema),
  createCategory,
);

categoryRouter.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateCategorySchema),
  updateCategory,
);

categoryRouter.delete("/:id", authenticate, authorize("admin"), deleteCategory);

export default categoryRouter;
