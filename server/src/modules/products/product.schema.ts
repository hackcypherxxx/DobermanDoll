import { z } from "zod";

export const productImageSchema = z.object({
  url: z.url(),
  cloudinaryPublicId: z.string().min(1),
  alt: z.string().min(1),
  position: z.number().int().default(0),
});

export const generateDescriptionSchema = z.object({
  name: z.string().min(2, "Product name is required for context"),
  shortDescription: z.string().min(10, "Please provide a short description"),
  imageUrl: z.url().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(2).max(150),
  sku: z.string().min(2),
  shortDescription: z.string().min(10),
  description: z.string().min(20),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  currency: z.string().length(3).default("USD"),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID"),
  tags: z.array(z.string()).default([]),
  material: z.string().min(1),
  size: z.string().min(1),
  weight: z.string().min(1),
  genderPresentation: z.string().min(1),
  includedAccessories: z.array(z.string()).default([]),
  stock: z.number().int().min(0).default(0),
  inventoryType: z.enum(["IN_STOCK", "MADE_TO_ORDER", "PRE_ORDER"]).default("IN_STOCK"),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  images: z.array(productImageSchema).default([]), // <-- ADDED
});

// Note: no defaults on update so PATCH doesn't wipe fields you didn't send
export const updateProductSchema = z.object({
  name: z.string().min(2).max(150).optional(),
  sku: z.string().min(2).optional(),
  shortDescription: z.string().min(10).optional(),
  description: z.string().min(20).optional(),
  price: z.number().positive().optional(),
  compareAtPrice: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  tags: z.array(z.string()).optional(),
  material: z.string().min(1).optional(),
  size: z.string().min(1).optional(),
  weight: z.string().min(1).optional(),
  genderPresentation: z.string().min(1).optional(),
  includedAccessories: z.array(z.string()).optional(),
  stock: z.number().int().min(0).optional(),
  inventoryType: z.enum(["IN_STOCK", "MADE_TO_ORDER", "PRE_ORDER"]).optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  images: z.array(productImageSchema).optional(), // <-- ADDED
});

export type GenerateDescriptionInput = z.infer<typeof generateDescriptionSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
