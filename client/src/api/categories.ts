import { api, unwrap } from "./client";
import type { ApiEnvelope, Category } from "@/types/api";

export function listCategories(): Promise<Category[]> {
  return unwrap<Category[]>(api.get<ApiEnvelope<Category[]>>("/categories"));
}

export function getCategoryBySlug(slug: string): Promise<Category> {
  return unwrap<Category>(
    api.get<ApiEnvelope<Category>>(`/categories/${encodeURIComponent(slug)}`)
  );
}
