import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import {
  addToCartSchema,
  updateCartItemSchema,
} from "../validations/cart.validation.js";

const cartRouter = express.Router();

// All Cart Routes (Protected)
cartRouter.get("/", authenticate, getCart);

cartRouter.post("/", authenticate, validate(addToCartSchema), addToCart);

cartRouter.put(
  "/:productId",
  authenticate,
  validate(updateCartItemSchema),
  updateCartItem,
);

cartRouter.delete("/:productId", authenticate, removeCartItem);

cartRouter.delete("/", authenticate, clearCart);

export default cartRouter;
