import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";
import deleteFromCloudinary from "../utils/cloudinaryDelete.js";
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      price,
      stock,
      isFeatured,
      isActive,
    } = req.body;

    // Check if category exists
    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product already exists",
      });
    }

    // Upload images to Cloudinary
    const uploadedImages = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer),
      );

      const results = await Promise.all(uploadPromises);

      uploadedImages.push(...results);
    }

    // Create Product
    const product = await Product.create({
      name,
      description,
      brand,
      category,
      price,
      stock,
      images: uploadedImages,
      isFeatured,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Get Product By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check category if it is being updated
    if (req.body.category) {
      const existingCategory = await Category.findById(req.body.category);

      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    let updatedImages = existingProduct.images;

    // If new images are uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      await Promise.all(
        existingProduct.images.map((image) =>
          deleteFromCloudinary(image.publicId),
        ),
      );

      // Upload new images
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer),
      );

      updatedImages = await Promise.all(uploadPromises);
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...req.body,
        images: updatedImages,
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("category");

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete all product images from Cloudinary
    if (existingProduct.images.length > 0) {
      await Promise.all(
        existingProduct.images.map((image) =>
          deleteFromCloudinary(image.publicId),
        ),
      );
    }

    // Delete product from MongoDB
    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
