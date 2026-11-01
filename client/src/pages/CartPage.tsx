import { Link } from "react-router-dom";
import { ArrowRight, X, Minus, Plus } from "lucide-react";
import { cartCount, cartSubtotal, useCartStore } from "@/stores/cartStore";
import { formatCurrency } from "@/lib/utils";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  
  const count = cartCount(items);
  const subtotal = cartSubtotal(items);

  if (items.length === 0) {
    return (
      <div className="bg-background pb-24 pt-20 text-center min-h-[60vh]">
        <div className="page-container max-w-lg mx-auto">
          <h1 className="font-display text-4xl text-text">Your Cart is Empty</h1>
          <p className="mt-4 text-sm text-text-secondary">Discover beautifully detailed reborn dolls, created to bring warmth into your world.</p>
          <Link to="/shop" className="mt-8 inline-flex h-12 items-center bg-rose-dark px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-rose transition-colors">
            Explore the Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background pb-24 pt-12 md:pt-20">
      <div className="page-container">
        
        <div className="border-b border-border pb-8 mb-10">
          <h1 className="font-display text-4xl text-text md:text-5xl">Shopping Cart</h1>
          <p className="mt-2 text-sm text-text-secondary">{count} {count === 1 ? "item" : "items"}</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16 items-start">
          
          {/* Items List */}
          <div className="border-t border-border">
            {items.map((item) => {
              const maxQty = item.inventoryType === "IN_STOCK" ? Math.max(1, item.stock) : 20;
              return (
                <div key={item.productId} className="flex gap-4 sm:gap-6 border-b border-border py-6">
                  <Link to={`/product/${item.slug}`} className="h-32 w-24 sm:h-40 sm:w-32 shrink-0 bg-cream overflow-hidden">
                    <ImageWithFallback src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                  </Link>
                  
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link to={`/product/${item.slug}`} className="font-display text-xl text-text hover:text-rose transition-colors line-clamp-2">{item.name}</Link>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-text-secondary">SKU: {item.sku}</p>
                      </div>
                      <button onClick={() => remove(item.productId)} className="p-1 h-fit text-text-secondary hover:text-rose-dark transition-colors">
                        <X className="h-5 w-5" strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex h-10 w-28 items-center border border-border">
                        <button onClick={() => setQuantity(item.productId, item.quantity - 1)} disabled={item.quantity <= 1} className="flex h-full w-9 items-center justify-center text-text hover:bg-cream disabled:opacity-30"><Minus className="h-3 w-3" /></button>
                        <span className="flex-1 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
                        <button onClick={() => setQuantity(item.productId, item.quantity + 1)} disabled={item.quantity >= maxQty} className="flex h-full w-9 items-center justify-center text-text hover:bg-cream disabled:opacity-30"><Plus className="h-3 w-3" /></button>
                      </div>
                      {/* Price */}
                      <p className="text-sm font-medium tabular-nums text-text">{formatCurrency(item.unitPrice * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="bg-cream p-6 sm:p-8 sticky top-28">
            <h2 className="font-display text-2xl text-text border-b border-border pb-4">Order Summary</h2>
            
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="tabular-nums text-text">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Shipping</span>
                <span className="text-[10px] uppercase tracking-wider">Calculated at checkout</span>
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-4 flex justify-between items-baseline">
              <span className="font-bold text-[11px] uppercase tracking-[0.15em] text-text">Estimated Total</span>
              <span className="font-display text-2xl text-text">{formatCurrency(subtotal)}</span>
            </div>

            <Link to="/checkout" className="mt-8 flex h-[52px] w-full items-center justify-center gap-2 bg-rose-dark text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-rose transition-colors">
              Checkout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
