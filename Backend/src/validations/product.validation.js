import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters"),

  brand: z
    .string()
    .trim()
    .min(2, "Brand name must be at least 2 characters")
    .max(100, "Brand name cannot exceed 100 characters"),

  category: z.string().trim().min(1, "Category is required"),

  price: z.coerce.number().min(0, "Price cannot be negative"),

  stock: z.coerce
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative"),

  isFeatured: z.coerce.boolean().optional(),

  isActive: z.coerce.boolean().optional(),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name cannot exceed 100 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  brand: z
    .string()
    .trim()
    .min(2, "Brand name must be at least 2 characters")
    .max(100, "Brand name cannot exceed 100 characters")
    .optional(),

  category: z.string().trim().optional(),

  price: z.coerce.number().min(0, "Price cannot be negative").optional(),

  stock: z.coerce
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .optional(),

  isFeatured: z.coerce.boolean().optional(),

  isActive: z.coerce.boolean().optional(),
});
