import { create } from "zustand";
import type { Admin } from "@/types/api";

interface AuthState {
  admin: Admin | null;
  setAdmin: (admin: Admin | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  admin: null,
  setAdmin: (admin) => set({ admin }),
  clear: () => set({ admin: null }),
}));
