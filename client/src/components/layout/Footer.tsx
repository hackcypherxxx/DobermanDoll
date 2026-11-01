import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-24 bg-rose-dark">
      <div className="page-container py-16">
        <div className="grid gap-12 md:grid-cols-4 md:gap-8">
          
          {/* Column 1: Brand */}
          <div>
            <Link to="/" className="flex flex-col items-start leading-none">
              <span className="font-display text-3xl tracking-tight text-brand">
                Dreambaby
              </span>
              <span className="mt-1.5 flex items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.32em] text-white/60">
                <span className="h-px w-3 bg-white/30" />
                Silicone Nursery
                <span className="h-px w-3 bg-white/30" />
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
              Beautifully detailed reborn dolls, created to bring warmth, wonder, and a little extra love into your world.
            </p>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[0.15em] text-white">Shop</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link to="/shop?newArrival=true" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop?featured=true" className="hover:text-white transition-colors">Beloved Favorites</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[0.15em] text-white">Customer Care</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/track" className="hover:text-white transition-colors">Order Tracking</Link></li>
            </ul>
          </div>

          {/* Column 4: Information */}
          <div>
            <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[0.15em] text-white">Information</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms and Conditions</Link></li>
            </ul>
          </div>

        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="page-container flex flex-col items-center justify-between gap-4 text-xs text-white/50 md:flex-row">
          <p>© {new Date().getFullYear()} Dreambaby Silicone Nursery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
