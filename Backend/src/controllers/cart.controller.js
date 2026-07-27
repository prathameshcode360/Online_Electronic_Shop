import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId }).populate(
      "items.product",
    );

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: {
          user: req.user.userId,
          items: [],
        },
      });
    }

    let cartModified = false;

    // Remove deleted products
    cart.items = cart.items.filter((item) => {
      if (!item.product) {
        cartModified = true;
        return false;
      }
      return true;
    });

    // Save cart if deleted products were removed
    if (cartModified) {
      await cart.save();
      await cart.populate("items.product");
    }

    // Check if cart is empty after cleanup
    if (cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        data: {
          _id: cart._id,
          user: cart.user,
          items: [],
          createdAt: cart.createdAt,
          updatedAt: cart.updatedAt,
        },
      });
    }

    // Prepare response
    const items = cart.items.map((item) => {
      let isAvailable = true;
      let availabilityMessage = "Available";

      if (!item.product.isActive) {
        isAvailable = false;
        availabilityMessage = "Product is not available";
      } else if (item.product.stock === 0) {
        isAvailable = false;
        availabilityMessage = "Product is out of stock";
      } else if (item.quantity > item.product.stock) {
        isAvailable = false;
        availabilityMessage = `Only ${item.product.stock} item(s) available`;
      }

      return {
        ...item.toObject(),
        isAvailable,
        availabilityMessage,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: {
        _id: cart._id,
        user: cart.user,
        items,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if product is active
    if (!product.isActive) {
      return res.status(409).json({
        success: false,
        message: "Product is not available",
      });
    }

    // Check stock once before any operations
    if (quantity > product.stock) {
      return res.status(409).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    // Find user's cart
    let cart = await Cart.findOne({ user: req.user.userId });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        items: [
          {
            product: productId,
            quantity,
          },
        ],
      });
    } else {
      // Check if product already exists in cart
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId,
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        // Check stock before increasing quantity
        if (newQuantity > product.stock) {
          return res.status(409).json({
            success: false,
            message: "Requested quantity exceeds available stock",
          });
        }

        existingItem.quantity = newQuantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
        });
      }

      await cart.save();
    }

    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Add To Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);

    if (!product) {
      // Remove the product from cart automatically
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId,
      );

      await cart.save();

      return res.status(404).json({
        success: false,
        message:
          "Product no longer exists and has been removed from your cart.",
      });
    }

    // Check if product is active
    if (!product.isActive) {
      return res.status(409).json({
        success: false,
        message: "Product is not available",
      });
    }

    // Check stock
    if (quantity > product.stock) {
      return res.status(409).json({
        success: false,
        message: "Requested quantity exceeds available stock",
      });
    }

    item.quantity = quantity;

    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Update Cart Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId,
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();
    await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Remove Cart Item Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is already empty",
        data: {
          user: req.user.userId,
          items: [],
        },
      });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Clear Cart Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
