import mongoose, { Schema, Document, Types } from "mongoose";

export interface ProductImage {
  url: string;
  cloudinaryPublicId: string;
  alt: string;
  position: number;
}

export interface ProductDocument extends Document {
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: ProductImage[];
  category: Types.ObjectId;
  tags: string[];
  material: string;
  size: string;
  weight: string;
  genderPresentation: string;
  includedAccessories: string[];
  stock: number;
  inventoryType: "IN_STOCK" | "MADE_TO_ORDER" | "PRE_ORDER";
  isPublished: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    currency: { type: String, default: "USD", length: 3 },
    images: [
      {
        url: { type: String, required: true },
        cloudinaryPublicId: { type: String, required: true },
        alt: { type: String, required: true },
        position: { type: Number, default: 0 },
      }
    ],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    tags: [{ type: String }],
    material: { type: String, required: true },
    size: { type: String, required: true },
    weight: { type: String, required: true },
    genderPresentation: { type: String, required: true },
    includedAccessories: [{ type: String }],
    stock: { type: Number, required: true, min: 0, default: 0 },
    inventoryType: { type: String, enum: ["IN_STOCK", "MADE_TO_ORDER", "PRE_ORDER"], default: "IN_STOCK" },
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

export const Product = mongoose.model<ProductDocument>("Product", productSchema);
