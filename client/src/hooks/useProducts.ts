import { useQuery } from "@tanstack/react-query";
import {
  getProductBySlug,
  listProducts,
  type ProductListParams,
} from "@/api/products";

export const productsQueryKey = (params?: ProductListParams) =>
  ["products", params ?? {}] as const;

export function useProducts(params?: ProductListParams) {
  return useQuery({
    queryKey: productsQueryKey(params),
    queryFn: () => listProducts(params),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug] as const,
    queryFn: () => getProductBySlug(slug),
    enabled: Boolean(slug),
  });
}
