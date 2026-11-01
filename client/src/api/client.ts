import axios, { AxiosError } from "axios";
import type { ApiEnvelope, ApiErrorBody } from "@/types/api";

/**
 * Custom error thrown by the API client so callers can access:
 * - message: user-facing message from the backend
 * - status: HTTP status code
 * - errors: Zod issue array (validation errors) or []
 */
export class ApiClientError extends Error {
  status?: number;
  errors: unknown[];

  constructor(message: string, status?: number, errors: unknown[] = []) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.errors = errors;
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1",
  withCredentials: true, // sends accessToken HttpOnly cookie
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiErrorBody>) => {
    const status = err.response?.status;
    const body = err.response?.data;
    const message =
      body?.message ?? err.message ?? "Something went wrong. Please try again.";
    const errors = body?.errors ?? [];
    return Promise.reject(new ApiClientError(message, status, errors));
  }
);

/**
 * Unwrap the backend's `{ success, message, data }` envelope and return
 * `data` directly. Errors are already thrown by the interceptor.
 */
export async function unwrap<T>(
  promise: Promise<{ data: ApiEnvelope<T> }>
): Promise<T> {
  const res = await promise;
  return res.data.data;
}
