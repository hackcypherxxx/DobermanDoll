import { api, unwrap } from "./client";
import type { ApiEnvelope, DashboardSummary } from "@/types/api";

export function getDashboard(): Promise<DashboardSummary> {
  return unwrap<DashboardSummary>(
    api.get<ApiEnvelope<DashboardSummary>>("/admin/dashboard")
  );
}
