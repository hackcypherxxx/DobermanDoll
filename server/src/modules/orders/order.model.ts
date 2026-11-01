import mongoose, { Schema, Document, Types } from "mongoose";

export interface OrderItem {
  productId: Types.ObjectId;
  name: string;
  slug: string;
  image?: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderDocument extends Document {
  orderNumber: string;
  customer: { name: string; email: string; phone: string };
  shippingAddress: { country: string; stateOrRegion: string; city: string; addressLine1: string; addressLine2?: string; postalCode: string };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  currency: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod?: string;
  preferredPaymentMethod?: string; // <--- ADDED
  paymentInstructions?: string;
  paymentReference?: string;
  paymentConfirmedAt?: Date;
  paymentConfirmedBy?: Types.ObjectId;
  shippingDetails?: {
    carrier: string;
    trackingNumber: string;
    trackingUrl?: string;
    shippedAt: Date;
  };
  receipt?: { receiptNumber: string; generatedAt: Date };
  customerNotes?: string;
  adminNotes?: string;
  trackingTokenHash?: string;
  trackingTokenExpiresAt?: Date;
  emailHistory: Array<{ type: string; sentAt: Date; status: string }>;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  image: { type: String },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  lineTotal: { type: Number, required: true, min: 0 },
});

const orderSchema = new Schema<OrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: { name: { type: String, required: true }, email: { type: String, required: true, lowercase: true, trim: true }, phone: { type: String, required: true } },
    shippingAddress: { country: { type: String, required: true }, stateOrRegion: { type: String, required: true }, city: { type: String, required: true }, addressLine1: { type: String, required: true }, addressLine2: { type: String }, postalCode: { type: String, required: true } },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "USD", length: 3 },
    orderStatus: { type: String, enum: ["PENDING", "AWAITING_PAYMENT", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED", "CANCELLED"], default: "PENDING" },
    paymentStatus: { type: String, enum: ["UNPAID", "INSTRUCTIONS_SENT", "PAYMENT_REPORTED", "PAID", "REFUNDED", "PARTIALLY_REFUNDED"], default: "UNPAID" },
    paymentMethod: { type: String },
    preferredPaymentMethod: { type: String }, // <--- ADDED
    paymentInstructions: { type: String },
    paymentReference: { type: String },
    paymentConfirmedAt: { type: Date },
    paymentConfirmedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
    shippingDetails: {
      carrier: { type: String },
      trackingNumber: { type: String },
      trackingUrl: { type: String },
      shippedAt: { type: Date },
    },
    receipt: { receiptNumber: { type: String }, generatedAt: { type: Date } },
    customerNotes: { type: String },
    adminNotes: { type: String },
    trackingTokenHash: { type: String },
    trackingTokenExpiresAt: { type: Date },
    emailHistory: [{ type: { type: String }, sentAt: { type: Date, default: Date.now }, status: { type: String } }],
  },
  { timestamps: true }
);

export const Order = mongoose.model<OrderDocument>("Order", orderSchema);
