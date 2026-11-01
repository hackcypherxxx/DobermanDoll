import { Link } from "react-router-dom";
import { ArrowRight, Shield, Truck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  subtotal: number;
  itemCount: number;
}

export function CartSummary({ subtotal, itemCount }: Props) {
  return (
    <div className="border border-border bg-surface p-6 sm:p-8">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-text">
        Order Summary
      </p>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex items-baseline justify-between">
          <dt className="text-text-secondary">
            Subtotal
            <span className="ml-2 text-[10px] uppercase tracking-[0.16em] text-text-secondary/60">
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          </dt>
          <dd className="tabular-nums text-text">
            {formatCurrency(subtotal)}
          </dd>
        </div>

        <div className="flex items-baseline justify-between">
          <dt className="text-text-secondary">Shipping</dt>
          <dd className="text-[10px] uppercase tracking-[0.16em] text-text-secondary">
            Calculated at checkout
          </dd>
        </div>

        <div className="flex items-baseline justify-between">
          <dt className="text-text-secondary">Tax</dt>
          <dd className="text-[10px] uppercase tracking-[0.16em] text-text-secondary">
            Calculated at checkout
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

      <Link
        to="/checkout"
        className="group mt-6 flex h-12 w-full items-center justify-center gap-2 bg-rose text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-colors hover:bg-rose-dark"
      >
        Proceed to Checkout
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
          strokeWidth={1.5}
        />
      </Link>

      <Link
        to="/shop"
        className="mt-4 block text-center text-[10px] uppercase tracking-[0.2em] text-text-secondary underline-offset-4 transition-colors hover:text-text hover:underline"
      >
        Continue Shopping
      </Link>

      {/* Trust signals */}
      <div className="mt-8 space-y-3 border-t border-border pt-6 text-[10px] uppercase tracking-[0.16em] text-text-secondary">
        <div className="flex items-center gap-3">
          <Truck className="h-3.5 w-3.5 shrink-0 text-text" strokeWidth={1.5} />
          <span>Complimentary shipping on orders over $199</span>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="h-3.5 w-3.5 shrink-0 text-text" strokeWidth={1.5} />
          <span>Every doll inspected before dispatch</span>
        </div>
      </div>
    </div>
  );
}
