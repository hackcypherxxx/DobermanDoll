import { api, unwrap } from "./client";
import type { Admin, ApiEnvelope } from "@/types/api";

export function login(email: string, password: string): Promise<Admin> {
  return unwrap<Admin>(
    api.post<ApiEnvelope<Admin>>("/auth/login", { email, password })
  );
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export function me(): Promise<Admin> {
  return unwrap<Admin>(api.get<ApiEnvelope<Admin>>("/auth/me"));
}
