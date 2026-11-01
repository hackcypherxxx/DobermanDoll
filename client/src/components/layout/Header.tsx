import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { cartCount, useCartStore } from "@/stores/cartStore";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop All" },
  { to: "/about", label: "Our Story" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const items = useCartStore((s) => s.items);
  const count = cartCount(items);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-surface">
        <div className="page-container">
          <div className="flex h-[72px] items-center justify-between md:h-[92px]">
            
            <div className="flex w-1/4 items-center justify-start">
              <button
                className="-ml-2 p-2 md:hidden"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6 text-text" strokeWidth={1.5} />
              </button>
              <Link to="/" className="group hidden flex-col items-start leading-none md:flex">
                <span className="font-display text-2xl tracking-tight text-brand transition-colors group-hover:text-rose lg:text-[28px]">
                  Dreambaby
                </span>
                <span className="mt-1 flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.32em] text-text-secondary">
                  <span className="h-px w-3 bg-text-secondary/50" />
                  Silicone Nursery
                  <span className="h-px w-3 bg-text-secondary/50" />
                </span>
              </Link>
            </div>

            <nav className="hidden items-center justify-center gap-6 md:flex md:w-2/4 lg:gap-8">
              {links.map((l) => (
                <NavLink
                  key={l.label}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) =>
                    `text-[10px] font-bold uppercase tracking-[0.18em] transition-colors hover:text-rose lg:text-[11px] ${
                      isActive ? "text-rose" : "text-text"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>

            <Link to="/" className="flex flex-col items-center leading-none md:hidden">
              <span className="font-display text-[22px] tracking-tight text-brand">
                Dreambaby
              </span>
              <span className="mt-1 text-[7px] font-semibold uppercase tracking-[0.28em] text-text-secondary">
                Silicone Nursery
              </span>
            </Link>

            <div className="flex w-1/4 items-center justify-end gap-2 md:gap-5">
              <button className="hidden p-2 md:block" aria-label="Search">
                <Search className="h-5 w-5 text-text" strokeWidth={1.5} />
              </button>
              <Link to="/cart" className="relative p-2" aria-label="Cart">
                <ShoppingBag className="h-5 w-5 text-text" strokeWidth={1.5} />
                {count > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose px-1 text-[9px] font-bold text-white">
                    {count}
                  </span>
                )}
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div className={`fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-sm flex-col bg-surface shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex flex-col items-start leading-none">
            <span className="font-display text-2xl text-brand">Dreambaby</span>
            <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.28em] text-text-secondary">
              Silicone Nursery
            </span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 -mr-2">
            <X className="h-6 w-6 text-text" />
          </button>
        </div>
        <nav className="flex flex-col px-6 py-8 gap-6 flex-1 overflow-y-auto">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.end}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `text-lg font-display transition-colors ${
                  isActive ? "text-rose" : "text-text hover:text-rose"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border px-6 py-6">
          <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between text-sm uppercase tracking-widest text-text">
            <span className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5" />
              Cart
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose text-xs font-bold text-white">{count}</span>
          </Link>
        </div>
      </div>
    </>
  );
}
