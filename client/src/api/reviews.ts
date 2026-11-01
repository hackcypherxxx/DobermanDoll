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

// Fallback fetcher: If GET /reviews doesn't exist, fetch all products and get their reviews
export async function listReviews(): Promise<Review[]> {
  try {
    const res = await api.get<ApiEnvelope<Review[]>>("/reviews");
    return res.data.data;
  } catch (err) {
    // Fallback: Fetch all products, then fetch reviews for each
    const productsRes = await api.get<ApiEnvelope<Product[]>>("/products");
    const products = productsRes.data.data;
    if (!products || products.length === 0) return [];
    
    const reviewsPromises = products.map(p => 
      api.get<ApiEnvelope<Review[]>>(`/reviews/product/${p._id}`)
    );
    const reviewsResponses = await Promise.all(reviewsPromises);
    const allReviews = reviewsResponses.flatMap(r => r.data.data);
    return allReviews;
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
