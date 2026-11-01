import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. Wait for the backend to verify the cookie
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-dark border-t-transparent" />
          <p className="font-display text-lg text-text-secondary animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  // 2. If not logged in, redirect immediately to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  // 3. Only render the Dashboard if authenticated
  return <Outlet />;
}
