// ... (Keep existing Admin, Category, Product, Order types the same) ...

export type DiscountType = "PERCENTAGE" | "FIXED";

export interface Coupon {
  _id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchaseAmount: number;
  maxUses: number;
  uses: number;
  expiresAt: string;
  isActive: boolean;
}

export interface Review {
  _id: string;
  productId: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}
