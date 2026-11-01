import { api, unwrap } from "./client";
import type { ApiEnvelope, Review, Product } from "@/types/api";

export interface CreateReviewPayload {
  productId: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  isApproved?: boolean;
}

export async function listReviews(): Promise<Review[]> {
  try {
    const res = await api.get<ApiEnvelope<Review[]>>("/reviews");
    return res.data.data;
  } catch {
    try {
      const productsRes = await api.get<ApiEnvelope<Product[]>>("/products");
      const products = productsRes.data.data;
      if (!products || products.length === 0) return [];

      const settled = await Promise.allSettled(
        products.map((p) => api.get<ApiEnvelope<Review[]>>(`/reviews/product/${p._id}`))
      );

      const allReviews: Review[] = [];
      for (const result of settled) {
        if (result.status === "fulfilled") {
          const payload = result.value.data.data;
          if (Array.isArray(payload)) allReviews.push(...payload);
        }
      }

      const unique = Array.from(new Map(allReviews.map((r) => [r._id, r])).values());
      return unique;
    } catch {
      return [];
    }
  }
}

export function createReview(payload: CreateReviewPayload): Promise<Review> {
  return unwrap<Review>(api.post<ApiEnvelope<Review>>("/reviews", payload));
}

export function listProductReviews(productId: string): Promise<Review[]> {
  return unwrap<Review[]>(
    api.get<ApiEnvelope<Review[]>>(`/reviews/product/${productId}`)
  );
}

export function createProductReview(payload: CreateReviewPayload): Promise<Review> {
  return unwrap<Review>(api.post<ApiEnvelope<Review>>("/reviews", payload));
}
