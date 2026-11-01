import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { me } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";

export const authQueryKey = ["auth-me"] as const;

export function useAuth() {
  const admin = useAuthStore((s) => s.admin);
  const setAdmin = useAuthStore((s) => s.setAdmin);

  const query = useQuery({
    queryKey: authQueryKey,
    queryFn: me,
    retry: false, // Don't retry if the cookie is invalid (401)
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      setAdmin(query.data);
    } else if (query.isError) {
      setAdmin(null);
    }
  }, [query.data, query.isError, setAdmin]);

  return {
    admin: admin ?? query.data ?? null,
    isLoading: query.isLoading,
    isAuthenticated: Boolean(admin ?? query.data),
    refetch: query.refetch,
  };
}
