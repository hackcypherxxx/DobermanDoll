import { Link } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { useCartStore, type CartItem } from "@/stores/cartStore";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  item: CartItem;
}

export function CartLineItem({ item }: Props) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);

  const isInStock = item.inventoryType === "IN_STOCK";
  const maxQty = isInStock ? Math.max(1, item.stock) : 20;
  const lineTotal = item.unitPrice * item.quantity;

  return (
    <div className="flex gap-4 border-b border-border py-6 sm:gap-6">
      {/* Image */}
      <Link
        to={`/product/${item.slug}`}
        className="block h-32 w-24 flex-shrink-0 overflow-hidden bg-cream sm:h-40 sm:w-32"
        aria-label={item.name}
      >
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="h-full w-full transition-transform duration-500 hover:scale-[1.03]"
        />
      </Link>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/product/${item.slug}`}
              className="block truncate font-display text-lg leading-tight text-text transition-colors hover:text-rose-dark sm:text-xl"
            >
              {item.name}
            </Link>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-text-secondary">
              {item.sku}
            </p>
            {!isInStock && (
              <p className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-text-secondary">
                {item.inventoryType === "MADE_TO_ORDER"
                  ? "Made to Order"
                  : "Pre-Order"}
              </p>
            )}
          </div>

          <button
            onClick={() => remove(item.productId)}
            className="flex-shrink-0 p-1 text-text-secondary transition-colors hover:text-text"
            aria-label={`Remove ${item.name} from cart`}
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          {/* Quantity selector */}
          <div className="flex h-10 items-center border border-border">
            <button
              onClick={() => setQuantity(item.productId, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="flex h-full w-9 items-center justify-center text-text transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" strokeWidth={1.5} />
            </button>
            <span className="w-8 text-center text-sm tabular-nums text-text">
              {item.quantity}
            </span>
            <button
              onClick={() => setQuantity(item.productId, item.quantity + 1)}
              disabled={item.quantity >= maxQty}
              className="flex h-full w-9 items-center justify-center text-text transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" strokeWidth={1.5} />
            </button>
          </div>

          {/* Line total */}
          <div className="text-right">
            <p
              className={cn(
                "text-sm font-medium tabular-nums text-text",
                item.quantity > 1 && "opacity-100"
              )}
            >
              {formatCurrency(lineTotal)}
            </p>
            {item.quantity > 1 && (
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-text-secondary">
                {formatCurrency(item.unitPrice)} each
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
