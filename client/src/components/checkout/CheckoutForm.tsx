import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/common/Input";
import { formatCurrency } from "@/lib/utils";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/schemas/checkout";

interface Props {
  onSubmit: (values: CheckoutFormValues) => void | Promise<void>;
  isSubmitting: boolean;
  serverError?: string | null;
  subtotal: number;
}

export function CheckoutForm({
  onSubmit,
  isSubmitting,
  serverError,
  subtotal,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer: { name: "", email: "", phone: "" },
      shippingAddress: {
        country: "",
        stateOrRegion: "",
        city: "",
        addressLine1: "",
        addressLine2: "",
        postalCode: "",
      },
      customerNotes: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12" noValidate>
      {serverError && (
        <div
          role="alert"
          className="border border-red-300 bg-red-50 p-4 text-sm leading-relaxed text-red-700"
        >
          {serverError}
        </div>
      )}

      {/* ==================== Contact ==================== */}
      <section>
        <h2 className="font-display text-2xl text-text sm:text-3xl">
          Contact
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          We&rsquo;ll use this to send your order updates and payment
          instructions.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Full name"
              type="text"
              autoComplete="name"
              {...register("customer.name")}
              error={errors.customer?.name?.message}
            />
          </div>
          <Input
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            {...register("customer.email")}
            error={errors.customer?.email?.message}
          />
          <Input
            label="Phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            {...register("customer.phone")}
            error={errors.customer?.phone?.message}
          />
        </div>
      </section>

      {/* ==================== Shipping ==================== */}
      <section>
        <h2 className="font-display text-2xl text-text sm:text-3xl">
          Shipping Address
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Where should we send your doll?
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Input
            label="Country"
            type="text"
            autoComplete="country-name"
            {...register("shippingAddress.country")}
            error={errors.shippingAddress?.country?.message}
          />
          <div className="sm:col-span-2">
            <Input
              label="Address line 1"
              type="text"
              autoComplete="address-line1"
              {...register("shippingAddress.addressLine1")}
              error={errors.shippingAddress?.addressLine1?.message}
            />
          </div>
          <div className="sm:col-span-2">
            <Input
              label="Address line 2 (optional)"
              type="text"
              autoComplete="address-line2"
              {...register("shippingAddress.addressLine2")}
              error={errors.shippingAddress?.addressLine2?.message}
            />
          </div>
          <Input
            label="City"
            type="text"
            autoComplete="address-level2"
            {...register("shippingAddress.city")}
            error={errors.shippingAddress?.city?.message}
          />
          <Input
            label="State / Region"
            type="text"
            autoComplete="address-level1"
            {...register("shippingAddress.stateOrRegion")}
            error={errors.shippingAddress?.stateOrRegion?.message}
          />
          <Input
            label="Postal code"
            type="text"
            autoComplete="postal-code"
            {...register("shippingAddress.postalCode")}
            error={errors.shippingAddress?.postalCode?.message}
          />
        </div>
      </section>

      {/* ==================== Notes ==================== */}
      <section>
        <h2 className="font-display text-2xl text-text sm:text-3xl">
          Order Notes
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Optional — anything we should know?
        </p>
        <div className="mt-6">
          <textarea
            rows={4}
            placeholder="Delivery instructions, gift notes, questions…"
            {...register("customerNotes")}
            className="w-full border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-secondary/50 focus:border-rose focus:outline-none"
          />
          {errors.customerNotes?.message && (
            <p className="mt-1 text-xs text-red-600">
              {errors.customerNotes.message}
            </p>
          )}
        </div>
      </section>

      {/* ==================== Payment note ==================== */}
      <section className="border-t border-border pt-10">
        <h2 className="font-display text-2xl text-text sm:text-3xl">
          Payment
        </h2>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-text-secondary">
          Payment is arranged manually after your order is placed. We will
          email you detailed payment instructions once we&rsquo;ve reviewed
          and confirmed availability. No payment is taken on this page.
        </p>
      </section>

      {/* ==================== Submit ==================== */}
      <div className="border-t border-border pt-10">
        <div className="mb-5 flex items-baseline justify-between">
          <span className="text-[11px] uppercase tracking-[0.22em] text-text">
            Estimated Total
          </span>
          <span className="text-2xl font-medium tabular-nums text-text">
            {formatCurrency(subtotal)}
          </span>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 w-full items-center justify-center bg-rose text-[11px] font-medium uppercase tracking-[0.22em] text-white transition-colors hover:bg-rose-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Placing Order…" : "Place Order"}
        </button>
        <p className="mt-4 text-center text-[10px] leading-relaxed text-text-secondary">
          By placing your order you agree to our shipping and returns
          policies.
        </p>
      </div>
    </form>
  );
}
