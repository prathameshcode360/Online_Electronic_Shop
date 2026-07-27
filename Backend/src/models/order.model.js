import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
          min: [0, "Price cannot be negative"],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
        minlength: [2, "Full name must be at least 2 characters"],
        maxlength: [50, "Full name cannot exceed 50 characters"],
      },
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        minlength: [10, "Phone number must be at least 10 characters"],
        maxlength: [15, "Phone number cannot exceed 15 characters"],
      },
      addressLine1: {
        type: String,
        required: [true, "Address line 1 is required"],
        trim: true,
        minlength: [5, "Address must be at least 5 characters"],
        maxlength: [100, "Address cannot exceed 100 characters"],
      },
      addressLine2: {
        type: String,
        trim: true,
        maxlength: [100, "Address line 2 cannot exceed 100 characters"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
        minlength: [2, "City must be at least 2 characters"],
        maxlength: [50, "City cannot exceed 50 characters"],
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
        minlength: [2, "State must be at least 2 characters"],
        maxlength: [50, "State cannot exceed 50 characters"],
      },
      postalCode: {
        type: String,
        required: [true, "Postal code is required"],
        trim: true,
        minlength: [4, "Postal code must be at least 4 characters"],
        maxlength: [10, "Postal code cannot exceed 10 characters"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
        minlength: [2, "Country must be at least 2 characters"],
        maxlength: [50, "Country cannot exceed 50 characters"],
      },
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
