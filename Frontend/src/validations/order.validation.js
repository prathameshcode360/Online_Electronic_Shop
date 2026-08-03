import { z } from "zod";

export const createOrderSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name cannot exceed 50 characters"),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 characters")
    .max(15, "Phone number cannot exceed 15 characters"),

  addressLine1: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address cannot exceed 100 characters"),

  addressLine2: z
    .string()
    .trim()
    .max(100, "Address line 2 cannot exceed 100 characters")
    .optional(),

  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(50, "City cannot exceed 50 characters"),

  state: z
    .string()
    .trim()
    .min(2, "State must be at least 2 characters")
    .max(50, "State cannot exceed 50 characters"),

  postalCode: z
    .string()
    .trim()
    .min(4, "Postal code must be at least 4 characters")
    .max(10, "Postal code cannot exceed 10 characters"),

  country: z
    .string()
    .trim()
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country cannot exceed 50 characters"),
});
