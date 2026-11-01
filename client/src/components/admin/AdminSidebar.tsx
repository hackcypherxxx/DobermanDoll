import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, Tags, LogOut, X, Star, Ticket } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { logout } from "@/api/auth";
import { cn } from "@/lib/utils";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/coupons", label: "Coupons", icon: Ticket },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
];

export function AdminSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const clearAuth = useAuthStore((s) => s.clear);
  const navigate = useNavigate();

  async function handleLogout() {
    try { await logout(); } catch {}
    clearAuth();
    navigate("/admin/login");
  }

  return (
    <>
      <div className={cn("fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")} onClick={onClose} />
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-rose-dark text-white transition-transform duration-300 lg:static lg:translate-x-0", isOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-[92px] items-center justify-between px-6 border-b border-white/10">
          <div className="flex flex-col items-start leading-none">
            <span className="font-display text-2xl text-brand">Dreambaby</span>
            <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.28em] text-white/60">Admin Portal</span>
          </div>
          <button onClick={onClose} className="p-2 lg:hidden"><X className="h-5 w-5 text-white" /></button>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-sm",
                  isActive ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <l.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:text-white">
            <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.5} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
