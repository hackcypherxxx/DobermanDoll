import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Package, Truck, CheckCircle2, Search } from "lucide-react";
import { trackOrder } from "@/api/orders";
import { formatCurrency } from "@/lib/utils";

const TRACK_IMAGE = "https://images.unsplash.com/photo-1522771731525-b214c84e5b6c?q=80&w=2000&auto=format&fit=crop";

export default function OrderTrackingPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [inputToken, setInputToken] = useState("");

  // If no token, show search form
  if (!token) {
    return (
      <div className="bg-background pb-24">
        <section className="relative flex h-[40vh] w-full items-center justify-center overflow-hidden bg-cream">
          <img src={TRACK_IMAGE} alt="Tracking" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 mx-auto max-w-2xl px-4 text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/90">Order Status</span>
            <h1 className="mt-4 font-display text-4xl text-white md:text-6xl">Track Your Order</h1>
          </div>
        </section>

        <div className="page-container max-w-md mx-auto mt-16 text-center">
          <p className="text-sm text-text-secondary mb-6">Enter the secure tracking token provided in your confirmation email.</p>
          <form 
            onSubmit={(e) => { e.preventDefault(); if (inputToken.trim()) navigate(`/track/${inputToken.trim()}`); }}
            className="flex flex-col gap-3"
          >
            <input 
              type="text" 
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="h-[52px] w-full border border-border bg-surface px-4 text-center text-sm text-text focus:border-rose-dark focus:outline-none"
            />
            <button type="submit" className="flex h-[52px] items-center justify-center gap-2 bg-rose-dark text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-rose transition-colors">
              <Search className="h-4 w-4" /> Track Order
            </button>
          </form>
        </div>
      </div>
    );
  }

  // If token exists, show tracking timeline
  return <TrackingView token={token} />;
}

function TrackingView({ token }: { token: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["track", token],
    queryFn: () => trackOrder(token),
    retry: false,
  });

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center font-display text-xl text-text-secondary">Loading order details...</div>;
  if (isError || !data) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-display text-3xl text-text">Order Not Found</h1>
      <p className="mt-2 text-sm text-text-secondary">The tracking link is invalid or has expired.</p>
      <Link to="/track" className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-rose-dark underline">Try again</Link>
    </div>
  );

  const steps = [
    { key: "PENDING", label: "Order Placed", icon: Package },
    { key: "PROCESSING", label: "Processing", icon: Package },
    { key: "SHIPPED", label: "Shipped", icon: Truck },
    { key: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
  ];

  const currentIndex = steps.findIndex((s) => s.key === data.orderStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="bg-background pb-24 pt-12 md:pt-20 min-h-[70vh]">
      <div className="page-container max-w-3xl">
        
        <div className="text-center mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-rose">Order #{data.orderNumber}</span>
          <h1 className="mt-2 font-display text-4xl text-text">Thank you for your order.</h1>
        </div>

        {/* Timeline */}
        <div className="mb-16 bg-cream p-8 md:p-12">
          <div className="relative flex justify-between">
            {/* Background line */}
            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-border" />
            {/* Active line */}
            <div 
              className="absolute left-0 top-1/2 h-px bg-rose-dark transition-all duration-1000 -translate-y-1/2" 
              style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
            />
            
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx <= activeIndex;
              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-500 ${isActive ? "border-rose-dark bg-rose-dark text-white" : "border-border bg-surface text-text-secondary"}`}>
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </div>
                  <span className={`absolute top-12 whitespace-nowrap text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-text" : "text-text-secondary"}`}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Details */}
        <div className="border border-border bg-surface p-6 sm:p-8">
          <h2 className="font-display text-xl text-text mb-4">Items in this order</h2>
          <ul className="divide-y divide-border">
            {data.items.map((i, idx) => (
              <li key={idx} className="flex justify-between py-3 text-sm">
                <span>{i.name} <span className="text-text-secondary text-xs ml-2">x{i.quantity}</span></span>
                <span className="font-medium tabular-nums">{formatCurrency(i.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-border flex justify-between font-bold text-[11px] uppercase tracking-[0.15em]">
            <span>Total</span>
            <span className="font-display text-lg">{formatCurrency(data.total)}</span>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link to="/shop" className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-dark underline">Return to Shop</Link>
        </div>

      </div>
    </div>
  );
}
