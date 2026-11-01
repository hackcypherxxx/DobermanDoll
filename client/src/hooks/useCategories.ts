import { useQuery } from "@tanstack/react-query";
import { getCategoryBySlug, listCategories } from "@/api/categories";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"] as const,
    queryFn: listCategories,
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ["category", slug] as const,
    queryFn: () => getCategoryBySlug(slug),
    enabled: Boolean(slug),
  });
}
