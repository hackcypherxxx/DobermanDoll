import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { useAuthStore } from "@/stores/authStore";

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const admin = useAuthStore((s) => s.admin);

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar (Mobile) */}
        <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b border-border bg-surface px-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
            <Menu className="h-6 w-6 text-text" strokeWidth={1.5} />
          </button>
          <span className="font-display text-lg text-text">Admin</span>
          <div className="w-6" /> {/* Spacer for centering */}
        </header>

        {/* Desktop Header / Welcome */}
        <header className="hidden lg:flex h-[92px] items-center justify-between border-b border-border bg-surface px-8">
          <div>
            <h1 className="font-display text-2xl text-text">Welcome back, {admin?.name || "Admin"}</h1>
            <p className="text-xs text-text-secondary mt-1">Here is what's happening in your boutique today.</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blush-light text-rose-dark font-display text-lg">
            {admin?.name?.charAt(0) || "A"}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
