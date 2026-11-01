import { api, unwrap } from "./client";
import type { ApiEnvelope, ContactPayload } from "@/types/api";

export function sendContactMessage(payload: ContactPayload): Promise<unknown> {
  return unwrap<unknown>(
    api.post<ApiEnvelope<unknown>>("/contact", payload)
  );
}
