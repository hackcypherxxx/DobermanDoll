export type AdminRole = "SUPER_ADMIN" | "ADMIN";

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: unknown[];
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
