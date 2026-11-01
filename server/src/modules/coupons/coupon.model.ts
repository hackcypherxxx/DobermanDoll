import mongoose, { Schema, Document } from "mongoose";

export interface CouponDocument extends Document {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minPurchaseAmount: number;
  maxUses: number;
  uses: number;
  expiresAt: Date;
  isActive: boolean;
}

const couponSchema = new Schema<CouponDocument>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ["PERCENTAGE", "FIXED"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minPurchaseAmount: { type: Number, default: 0 },
    maxUses: { type: Number, default: 1000 },
    uses: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model<CouponDocument>("Coupon", couponSchema);
