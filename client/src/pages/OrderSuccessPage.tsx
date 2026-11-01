import { useMemo, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Mail, Package } from "lucide-react";
import { Container } from "@/components/common/Container";

const LAST_ORDER_KEY = "reborn-last-order";

interface SuccessState {
  orderNumber: string;
  trackingToken?: string;
  customerEmail?: string;
}

export default function OrderSuccessPage() {
  const location = useLocation();

  const data = useMemo<SuccessState | null>(() => {
    const state = location.state as unknown;
    if (
      state &&
      typeof state === "object" &&
      "orderNumber" in state &&
      typeof (state as SuccessState).orderNumber === "string"
    ) {
      return state as SuccessState;
    }
    try {
      const raw = sessionStorage.getItem(LAST_ORDER_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as SuccessState;
      return parsed?.orderNumber ? parsed : null;
    } catch {
      return null;
    }
  }, [location.state]);

  if (!data) return <NoOrderState />;

  return (
    <div className="bg-background pb-24 pt-14 md:pb-32 md:pt-20">
      <Container>
        {/* Header block */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center border border-border text-success">
            <CheckCircle2 className="h-7 w-7" strokeWidth={1} />
          </span>
          <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-text-secondary">
            Order Placed
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] text-text sm:text-5xl md:text-6xl">
            Thank you.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-text-secondary">
            Your order has been received. We&rsquo;ll be in touch shortly with
            payment instructions and confirmation.
          </p>
        </div>

        {/* Order number card */}
        <div className="mx-auto mt-12 max-w-lg border border-border bg-surface p-6 sm:p-8">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.22em] text-text-secondary">
              Order Number
            </span>
            <span className="font-display text-2xl text-text">
              {data.orderNumber}
            </span>
          </div>
        </div>

        {/* Next steps */}
        <div className="mx-auto mt-16 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-text-secondary">
            What happens next
          </p>
          <ol className="mt-6 space-y-7">
            <Step
              icon={<Mail className="h-4 w-4" strokeWidth={1.5} />}
              title="Check your inbox"
              body={
                data.customerEmail
                  ? `Payment instructions will be sent to ${data.customerEmail} after we review your order.`
                  : "Payment instructions will be sent to the email you provided after we review your order."
              }
            />
            <Step
              icon={<CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />}
              title="Confirm payment"
              body="Reply to the email with proof of payment. We will confirm receipt and begin preparing your doll."
            />
            <Step
              icon={<Package className="h-4 w-4" strokeWidth={1.5} />}
              title="Tracking begins"
              body="Once payment is confirmed, we dispatch your doll and send you tracking details."
            />
          </ol>
        </div>

        {/* Actions */}
        <div className="mx-auto mt-12 flex max-w-md flex-col items-stretch gap-3">
          {data.trackingToken && (
            <Link
              to={`/track/${encodeURIComponent(data.trackingToken)}`}
              className="flex h-12 items-center justify-center bg-rose text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-colors hover:bg-rose-dark"
            >
              Track This Order
            </Link>
          )}
          <Link
            to="/shop"
            className="flex h-12 items-center justify-center border border-border text-[10px] uppercase tracking-[0.22em] text-text transition-colors hover:border-text/40 hover:bg-cream"
          >
            Continue Shopping
          </Link>
        </div>
      </Container>
    </div>
  );
}

function Step({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-border text-text">
        {icon}
      </span>
      <div>
        <p className="text-sm font-medium text-text">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">{body}</p>
      </div>
    </li>
  );
}

function NoOrderState() {
  return (
    <div className="bg-background pb-24 pt-14 md:pb-32 md:pt-20">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <h1 className="font-display text-4xl leading-tight text-text sm:text-5xl">
            No order to display.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            This page appears after you place an order. If you&rsquo;ve already
            placed one, check your email for confirmation — or contact us and
            we&rsquo;ll help.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/shop"
              className="inline-flex h-11 items-center bg-rose px-7 text-[10px] uppercase tracking-[0.22em] text-white transition-colors hover:bg-rose-dark"
            >
              Shop the Collection
            </Link>
            <Link
              to="/contact"
              className="inline-flex h-11 items-center border border-border px-7 text-[10px] uppercase tracking-[0.22em] text-text transition-colors hover:border-text/40 hover:bg-cream"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
