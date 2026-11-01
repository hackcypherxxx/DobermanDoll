import mongoose, { Schema, Document, Types } from "mongoose";

export interface ReviewDocument extends Document {
  productId: Types.ObjectId;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
}

const reviewSchema = new Schema<ReviewDocument>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, lowercase: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    isApproved: { type: Boolean, default: false }, // Admin must approve before it shows
  },
  { timestamps: true }
);

export const Review = mongoose.model<ReviewDocument>("Review", reviewSchema);
