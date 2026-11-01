import { z } from "zod";

export const generateDescriptionSchema = z.object({
  name: z.string().min(2, "Product name is required for context"),
  shortDescription: z.string().min(10, "Please provide a short description (e.g., '12 inch silicone girl with rooted hair')"),
  imageUrl: z.url("Must be a valid image URL").optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(2).max(150),
  sku: z.string().min(2),
  shortDescription: z.string().min(10),
  description: z.string().min(20), // This will be the HTML from Gemini
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
});

export const updateProductSchema = createProductSchema.partial();

export type GenerateDescriptionInput = z.infer<typeof generateDescriptionSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
