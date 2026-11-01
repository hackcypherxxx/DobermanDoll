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

// Robust fetcher: Falls back to fetching product-by-product if global endpoint doesn't exist
export async function listReviews(): Promise<Review[]> {
  try {
    // 1. Try the global endpoint first
    const res = await api.get<ApiEnvelope<Review[]>>("/reviews");
    return res.data.data;
  } catch (err) {
    // 2. Fallback: Fetch all products, then fetch reviews for each
    try {
      const productsRes = await api.get<ApiEnvelope<Product[]>>("/products");
      const products = productsRes.data.data;
      if (!products || products.length === 0) return [];
      
      // Use allSettled so one failed request doesn't break the batch
      const reviewsResponses = await Promise.allSettled(
        products.map(p => api.get<ApiEnvelope<Review[]>>(`/reviews/product/${p._id}`))
      );
      
      const allReviews = reviewsResponses
        .filter((res): res is PromiseFulfilledResult<any> => res.status === "fulfilled")
        .flatMap(r => r.value.data.data || []);

      // Deduplicate reviews by _id (in case a review somehow appears twice)
      const uniqueReviews = Array.from(new Map(allReviews.map(r => [r._id, r])).values());
      
      return uniqueReviews;
    } catch (fallbackErr) {
      console.error("Failed to fetch reviews:", fallbackErr);
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
  return unwrap<Review>(
    api.post<ApiEnvelope<Review>>("/reviews", payload)
  );
}
