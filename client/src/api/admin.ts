import { api, unwrap } from "./client";
import type { 
  ApiEnvelope, 
  Category, 
  Order, 
  Product, 
  Coupon, 
  Review,
  SendPaymentInstructionsPayload,
  ShipOrderPayload 
} from "@/types/api";

// ============================================================
// Categories
// ============================================================
export function adminListCategories(): Promise<Category[]> {
  return unwrap<Category[]>(api.get<ApiEnvelope<Category[]>>("/admin/categories"));
}

export function adminCreateCategory(body: Partial<Category>): Promise<Category> {
  return unwrap<Category>(api.post<ApiEnvelope<Category>>("/admin/categories", body));
}

export function adminUpdateCategory(id: string, body: Partial<Category>): Promise<Category> {
  return unwrap<Category>(api.patch<ApiEnvelope<Category>>(`/admin/categories/${id}`, body));
}

export function adminDeleteCategory(id: string): Promise<void> {
  return api.delete(`/admin/categories/${id}`);
}

// ============================================================
// Products
// ============================================================
export function adminListProducts(): Promise<Product[]> {
  return unwrap<Product[]>(api.get<ApiEnvelope<Product[]>>("/admin/products"));
}

export function adminGetProduct(id: string): Promise<Product> {
  return unwrap<Product>(api.get<ApiEnvelope<Product>>(`/admin/products/${id}`));
}

export function adminCreateProduct(body: Partial<Product>): Promise<Product> {
  return unwrap<Product>(api.post<ApiEnvelope<Product>>("/admin/products", body));
}

export function adminUpdateProduct(id: string, body: Partial<Product>): Promise<Product> {
  return unwrap<Product>(api.patch<ApiEnvelope<Product>>(`/admin/products/${id}`, body));
}

export function adminDeleteProduct(id: string): Promise<void> {
  return api.delete(`/admin/products/${id}`);
}

// Upload & AI
export function adminUploadImage(file: File): Promise<{ url: string; publicId: string }> {
  const form = new FormData();
  form.append("image", file);
  return unwrap<{ url: string; publicId: string }>(
    api.post<ApiEnvelope<{ url: string; publicId: string }>>("/admin/products/upload-image", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  );
}

export function adminGenerateDescription(data: { name: string; shortDescription: string; imageUrl?: string }): Promise<{ description: string }> {
  return unwrap<{ description: string }>(
    api.post<ApiEnvelope<{ description: string }>>("/admin/products/generate-description", data)
  );
}

// Legacy Image endpoints (if needed)
export function adminDeleteProductImage(productId: string, imageId: string): Promise<Product> {
  return unwrap<Product>(
    api.delete<ApiEnvelope<Product>>(`/admin/products/${productId}/images/${imageId}`)
  );
}

// ============================================================
// Orders
// ============================================================
export function adminListOrders(): Promise<Order[]> {
  return unwrap<Order[]>(api.get<ApiEnvelope<Order[]>>("/admin/orders"));
}

export function adminGetOrder(id: string): Promise<Order> {
  return unwrap<Order>(api.get<ApiEnvelope<Order>>(`/admin/orders/${id}`));
}

export function adminSendPaymentInstructions(
  id: string,
  body: SendPaymentInstructionsPayload
): Promise<Order> {
  return unwrap<Order>(
    api.post<ApiEnvelope<Order>>(`/admin/orders/${id}/payment-instructions`, body)
  );
}

export function adminConfirmPayment(id: string, paymentReference?: string): Promise<Order> {
  return unwrap<Order>(
    api.post<ApiEnvelope<Order>>(`/admin/orders/${id}/confirm-payment`, { paymentReference })
  );
}

export function adminShipOrder(id: string, body: ShipOrderPayload): Promise<Order> {
  return unwrap<Order>(
    api.post<ApiEnvelope<Order>>(`/admin/orders/${id}/ship`, body)
  );
}

export function adminDeliverOrder(id: string): Promise<Order> {
  return unwrap<Order>(api.post<ApiEnvelope<Order>>(`/admin/orders/${id}/deliver`));
}

export function adminSendOrderMessage(id: string, message: string): Promise<{ success: boolean }> {
  return unwrap<{ success: boolean }>(
    api.post<ApiEnvelope<{ success: boolean }>>(`/admin/orders/${id}/messages`, { message })
  );
}

export function adminResendReceipt(id: string): Promise<void> {
  return api.post(`/admin/orders/${id}/resend-receipt`);
}

// ============================================================
// Coupons
// ============================================================
export function adminListCoupons(): Promise<Coupon[]> {
  return unwrap<Coupon[]>(api.get<ApiEnvelope<Coupon[]>>("/admin/coupons"));
}

export function adminCreateCoupon(data: Partial<Coupon>): Promise<Coupon> {
  return unwrap<Coupon>(api.post<ApiEnvelope<Coupon>>("/admin/coupons", data));
}

export function adminDeleteCoupon(id: string): Promise<void> {
  return api.delete(`/admin/coupons/${id}`);
}

// ============================================================
// Reviews
// ============================================================
export function adminListReviews(): Promise<Review[]> {
  return unwrap<Review[]>(api.get<ApiEnvelope<Review[]>>("/admin/reviews"));
}

export function adminApproveReview(id: string): Promise<Review> {
  return unwrap<Review>(api.patch<ApiEnvelope<Review>>(`/admin/reviews/${id}/approve`, {}));
}

export function adminDeleteReview(id: string): Promise<void> {
  return api.delete(`/admin/reviews/${id}`);
}
