import { api, unwrap } from "./client";
import type {
  ApiEnvelope,
  CreateOrderPayload,
  CreateOrderResponse,
  TrackedOrder,
} from "@/types/api";

/**
 * Guest checkout. Returns the created order plus a trackingToken the
 * customer can use to access /orders/track/:token without an account.
 */
export function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  return unwrap<CreateOrderResponse>(
    api.post<ApiEnvelope<CreateOrderResponse>>("/orders", payload)
  );
}

/**
 * Public tracking by opaque token. Returns non-sensitive fields only.
 */
export function trackOrder(token: string): Promise<TrackedOrder> {
  return unwrap<TrackedOrder>(
    api.get<ApiEnvelope<TrackedOrder>>(
      `/orders/track/${encodeURIComponent(token)}`
    )
  );
}
