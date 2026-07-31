import dotenv from "dotenv";
import connectDB from "./database/dbConfig.js";

import Category from "./models/category.model.js";
import Product from "./models/product.model.js";

import categories from "./data/categories.js";
import products from "./data/products.js";

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    // Delete existing data
    await Product.deleteMany();
    await Category.deleteMany();

    // Insert categories
    const createdCategories = await Category.insertMany(categories);

    // Create category lookup map
    const categoryMap = {};

    createdCategories.forEach((category) => {
      categoryMap[category.name] = category._id;
    });

    // Replace category names with ObjectIds
    const seededProducts = products.map((product) => ({
      ...product,
      category: categoryMap[product.category],
    }));

    // Insert products
    await Product.insertMany(seededProducts);

    console.log("✅ Database seeded successfully.");

    process.exit();
  } catch (error) {
    console.error("❌ Seeder Error:", error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await Category.deleteMany();

    console.log("🗑️ Database cleared successfully.");

    process.exit();
  } catch (error) {
    console.error("❌ Seeder Error:", error);
    process.exit(1);
  }
};

if (process.argv[2] === "--delete") {
  destroyData();
} else {
  importData();
}
