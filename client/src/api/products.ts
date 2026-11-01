import { api, unwrap } from "./client";
import type { ApiEnvelope, Product } from "@/types/api";

export interface ProductListParams {
  category?: string;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
}

export function listProducts(params?: ProductListParams): Promise<Product[]> {
  const query: Record<string, string> = {};
  if (params?.category) query.category = params.category;
  if (params?.featured) query.featured = "true";
  if (params?.bestSeller) query.bestSeller = "true";
  if (params?.newArrival) query.newArrival = "true";

  return unwrap<Product[]>(
    api.get<ApiEnvelope<Product[]>>("/products", { params: query })
  );
}

export function getProductBySlug(slug: string): Promise<Product> {
  return unwrap<Product>(
    api.get<ApiEnvelope<Product>>(`/products/${encodeURIComponent(slug)}`, {
      headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    })
  );
}
