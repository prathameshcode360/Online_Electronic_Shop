import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

// Helper function to calculate total amount
const calculateTotalAmount = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Helper function to validate and process order items (now within transaction)
const validateAndProcessItems = async (cartItems, session) => {
  const processedItems = [];
  let totalAmount = 0;

  for (const cartItem of cartItems) {
    // Find the product within the transaction
    const product = await Product.findById(cartItem.product).session(session);

    if (!product) {
      throw new Error(`Product not found: ${cartItem.product}`);
    }

    if (!product.isActive) {
      throw new Error(`Product "${product.name}" is no longer available`);
    }

    // We don't check stock here anymore - we'll do it atomically
    // Use the product's current price
    const currentPrice = product.price;

    processedItems.push({
      product: product._id,
      quantity: cartItem.quantity,
      price: currentPrice,
    });

    totalAmount += currentPrice * cartItem.quantity;
  }

  return { processedItems, totalAmount };
};

// Helper function to atomically deduct stock for all items
const deductStockAtomically = async (items, session) => {
  const stockErrors = [];

  for (const item of items) {
    // ATOMIC OPERATION: Check stock AND deduct in one go
    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: item.product,
        stock: { $gte: item.quantity }, // Only update if stock is sufficient
      },
      {
        $inc: { stock: -item.quantity },
      },
      {
        new: true,
        session,
        runValidators: true,
      },
    );

    if (!updatedProduct) {
      // Product not found or insufficient stock
      const product = await Product.findById(item.product).session(session);
      const productName = product ? product.name : "Unknown product";
      const currentStock = product ? product.stock : 0;
      stockErrors.push(
        `Insufficient stock for "${productName}". Available: ${currentStock}, Requested: ${item.quantity}`,
      );
    }
  }

  if (stockErrors.length > 0) {
    throw new Error(stockErrors.join("; "));
  }
};

// 1. Create Order from Cart
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find user's cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(400).json({
        success: false,
        message: "Cart not found. Please add items to your cart first.",
      });
    }

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty. Please add items before placing an order.",
      });
    }

    // Get shipping address from request body
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required.",
      });
    }

    // Validate shipping address required fields
    const requiredAddressFields = [
      "fullName",
      "phone",
      "addressLine1",
      "city",
      "state",
      "postalCode",
      "country",
    ];
    for (const field of requiredAddressFields) {
      if (!shippingAddress[field]) {
        return res.status(400).json({
          success: false,
          message: `Shipping address ${field} is required.`,
        });
      }
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    let order;

    try {
      // Process items and calculate total
      const { processedItems, totalAmount } = await validateAndProcessItems(
        cart.items,
        session,
      );

      // ATOMIC: Deduct stock for all items
      await deductStockAtomically(processedItems, session);

      // Create the order
      order = new Order({
        user: userId,
        items: processedItems,
        totalAmount,
        shippingAddress,
        orderStatus: "pending",
        paymentStatus: "pending",
      });

      // Save the order
      await order.save({ session });

      // Clear the cart
      await Cart.findByIdAndUpdate(cart._id, { items: [] }, { session });

      // Commit the transaction
      await session.commitTransaction();
    } catch (error) {
      // Rollback transaction on error
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    // Populate the order with user and product details
    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product", "name images price");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: populatedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// 2. Get My Orders (for authenticated user)
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, orderStatus, paymentStatus } = req.query;

    // Build filter
    const filter = { user: userId };
    if (orderStatus) filter.orderStatus = orderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, totalCount] = await Promise.all([
      Order.find(filter)
        .populate("items.product", "name images price")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// 3. Get Order By ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Find the order
    const order = await Order.findById(orderId)
      .populate("user", "name email phone")
      .populate("items.product", "name images price category");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check authorization: user can view their own order, admin can view any
    if (userRole !== "admin" && order.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own orders.",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// 4. Get All Orders (Admin only)
export const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      orderStatus,
      paymentStatus,
      startDate,
      endDate,
      userId,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter
    const filter = {};
    if (orderStatus) filter.orderStatus = orderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (userId) filter.user = userId;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    const [orders, totalCount] = await Promise.all([
      Order.find(filter)
        .populate("user", "name email phone")
        .populate("items.product", "name images price")
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter),
    ]);

    // Calculate summary statistics
    const summary = await Order.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          averageOrderValue: { $avg: "$totalAmount" },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "pending"] }, 1, 0] },
          },
          confirmedOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "confirmed"] }, 1, 0] },
          },
          shippedOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "shipped"] }, 1, 0] },
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0] },
          },
        },
      },
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).json({
      success: true,
      data: orders,
      summary: summary[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// 5. Update Order Status (Admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, notes } = req.body;

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: "Order status is required",
      });
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Prevent updating if order is already delivered or cancelled
    if (
      order.orderStatus === "delivered" ||
      order.orderStatus === "cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot update status. Order is already ${order.orderStatus}`,
      });
    }

    // If cancelling order, restore stock atomically
    if (orderStatus === "cancelled" && order.orderStatus !== "cancelled") {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Atomically restore stock for each item
        for (const item of order.items) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: item.quantity } },
            { session },
          );
        }

        // Update order status
        order.orderStatus = orderStatus;
        // Only set notes if the field exists in schema
        if (notes && order.schema.path("notes")) {
          order.notes = notes;
        }
        await order.save({ session });

        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    } else {
      // Simple status update
      order.orderStatus = orderStatus;
      // Only set notes if the field exists in schema
      if (notes && order.schema.path("notes")) {
        order.notes = notes;
      }
      await order.save();
    }

    const updatedOrder = await Order.findById(orderId)
      .populate("user", "name email phone")
      .populate("items.product", "name images price");

    res.status(200).json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// 6. Update Payment Status (Admin only)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus, paymentId, notes } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required",
      });
    }

    const validStatuses = ["pending", "paid", "failed"];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Cannot update payment status for cancelled orders
    if (order.orderStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot update payment status for cancelled orders",
      });
    }

    // Only set fields that exist in the schema
    order.paymentStatus = paymentStatus;

    if (paymentId && order.schema.path("paymentId")) {
      order.paymentId = paymentId;
    }

    if (notes && order.schema.path("notes")) {
      order.notes = notes;
    }

    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate("user", "name email phone")
      .populate("items.product", "name images price");

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Update payment status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment status",
      error: error.message,
    });
  }
};
