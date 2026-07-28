import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./src/database/dbConfig.js";
import userRouter from "./src/routes/user.routes.js";
import categoryRouter from "./src/routes/category.routes.js";
import productRouter from "./src/routes/product.routes.js";
import cartRouter from "./src/routes/cart.routes.js";
import orderRouter from "./src/routes/order.routes.js";
import adminRouter from "./src/routes/admin.routes.js";

const app = express();

app.use(express.json()); // <-- Add this

app.get("/", (req, res) => {
  res.send("Welcome to Express Server");
});

app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/admin", adminRouter);

const port = process.env.PORT || 3500;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
