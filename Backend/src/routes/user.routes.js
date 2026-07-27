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

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);

userRouter.get("/profile", authenticate, getProfile);
userRouter.get("/", authenticate, authorize("admin"), getUsers);
userRouter.get("/:id", authenticate, authorize("admin"), getUserById);

export default userRouter;
