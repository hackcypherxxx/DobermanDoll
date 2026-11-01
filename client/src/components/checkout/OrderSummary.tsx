import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { formatCurrency } from "@/lib/utils";
import type { CartItem } from "@/stores/cartStore";

interface Props {
  items: CartItem[];
  subtotal: number;
}

export function OrderSummary({ items, subtotal }: Props) {
  return (
    <div className="border border-border bg-surface p-6 sm:p-8">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-text">
        Order Summary
      </p>

      <ul className="mt-6 divide-y divide-border">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-3 py-3 first:pt-0 last:pb-0">
            <div className="h-20 w-16 flex-shrink-0 overflow-hidden bg-cream">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="h-full w-full"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="truncate text-sm text-text">{item.name}</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-text-secondary">
                Qty {item.quantity}
              </p>
            </div>
            <p className="shrink-0 text-sm tabular-nums text-text">
              {formatCurrency(item.unitPrice * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
        <div className="flex items-baseline justify-between">
          <dt className="text-text-secondary">Subtotal</dt>
          <dd className="tabular-nums text-text">{formatCurrency(subtotal)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-text-secondary">Shipping</dt>
          <dd className="text-right text-[10px] uppercase tracking-[0.16em] text-text-secondary">
            Confirmed after review
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-text-secondary">Tax</dt>
          <dd className="text-right text-[10px] uppercase tracking-[0.16em] text-text-secondary">
            Confirmed after review
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex items-baseline justify-between border-t border-border pt-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-text">
          Estimated Total
        </p>
        <p className="text-xl font-medium tabular-nums text-text">
          {formatCurrency(subtotal)}
        </p>
      </div>

      <p className="mt-4 text-[10px] leading-relaxed text-text-secondary">
        Final total including shipping and applicable taxes is confirmed when
        your order is reviewed.
      </p>
    </div>
  );
}
