export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  errors: unknown[];
}

// ============================================================
// Admin
// ============================================================
export type AdminRole = "SUPER_ADMIN" | "ADMIN";

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

// ============================================================
// Category
// ============================================================
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isPublished: boolean;
  sortOrder: number;
}

// ============================================================
// Product
// ============================================================
export interface ProductImage {
  url: string;
  cloudinaryPublicId: string;
  alt: string;
  position: number;
}

export type InventoryType = "IN_STOCK" | "MADE_TO_ORDER" | "PRE_ORDER";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: ProductImage[];
  category: string | Category;
  tags: string[];
  material: string;
  size: string;
  weight: string;
  genderPresentation: string;
  includedAccessories: string[];
  stock: number;
  inventoryType: InventoryType;
  isPublished: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

// ============================================================
// Order
// ============================================================
export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  country: string;
  stateOrRegion: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  image?: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export type OrderStatus =
  | "PENDING"
  | "AWAITING_PAYMENT"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus =
  | "UNPAID"
  | "INSTRUCTIONS_SENT"
  | "PAYMENT_REPORTED"
  | "PAID"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export interface ShippingDetails {
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  shippedAt: string;
}

export interface OrderReceipt {
  receiptNumber: string;
  generatedAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: Customer;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  currency: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentInstructions?: string;
  paymentReference?: string;
  paymentConfirmedAt?: string;
  shippingDetails?: ShippingDetails;
  receipt?: OrderReceipt;
  customerNotes?: string;
  createdAt: string;
}

export interface CreateOrderPayload {
  customer: Customer;
  shippingAddress: ShippingAddress;
  items: { productId: string; quantity: number }[];
  customerNotes?: string;
  couponCode?: string;
}

export interface CreateOrderResponse {
  order: Order;
  trackingToken: string;
}

export interface TrackedOrder {
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  total: number;
  shippingDetails?: ShippingDetails;
}

// ============================================================
// Contact
// ============================================================
export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

// ============================================================
// Dashboard
// ============================================================
export interface DashboardSummary {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  recentOrders: Order[];
}

// ============================================================
// Admin payloads
// ============================================================
export interface SendPaymentInstructionsPayload {
  paymentMethod: string;
  paymentInstructions: string;
}

export interface ShipOrderPayload {
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
}

// ============================================================
// Coupons
// ============================================================
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

// ============================================================
// Reviews
// ============================================================
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
