import express from "express";
import {
  register,
  login,
  getProfile,
  getUsers,
  getUserById,
} from "../controllers/user.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import validate from "../middleware/validation.middleware.js";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validations/user.validation.js";

const userRouter = express.Router();

// Public Routes
userRouter.post("/register", validate(registerUserSchema), register);
userRouter.post("/login", validate(loginUserSchema), login);

// Protected Routes
userRouter.get("/profile", authenticate, getProfile);

// Admin Routes
userRouter.get("/", authenticate, authorize("admin"), getUsers);
userRouter.get("/:id", authenticate, authorize("admin"), getUserById);

export default userRouter;
