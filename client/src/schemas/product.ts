import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  sku: z.string().min(2, "SKU is required"),
  shortDescription: z.string().min(10, "Short description is required"),
  description: z.string().min(10, "Full HTML description is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  compareAtPrice: z.coerce.number().optional().or(z.literal(0).transform(() => undefined)),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce.number().min(0),
  inventoryType: z.enum(["IN_STOCK", "MADE_TO_ORDER", "PRE_ORDER"]),
  material: z.string().min(1, "Material is required"),
  size: z.string().min(1, "Size is required"),
  weight: z.string().min(1, "Weight is required"),
  genderPresentation: z.string().min(1, "Presentation is required"),
  includedAccessories: z.string().optional(),
  tags: z.string().optional(),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
  isBestSeller: z.boolean(),
  isNewArrival: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
