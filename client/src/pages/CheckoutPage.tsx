import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Lock, Ticket, CheckCircle2, X } from "lucide-react";
import { createOrder } from "@/api/orders";
import { ApiClientError } from "@/api/client";
import { cartSubtotal, useCartStore } from "@/stores/cartStore";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/common/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, type CheckoutFormValues } from "@/schemas/checkout";
import { api, unwrap } from "@/api/client"; // For validating coupon

export const LAST_ORDER_KEY = "reborn-last-order";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const subtotal = cartSubtotal(items);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  // Validate Coupon Mutation
  const couponMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await api.get(`/coupons/${code}`);
      return unwrap(res);
    },
    onSuccess: (data) => { setAppliedCoupon(data); setCouponError(""); },
    onError: (err: any) => { setAppliedCoupon(null); setCouponError(err.message || "Invalid coupon code."); }
  });

  const orderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      const successState = { orderNumber: data.order.orderNumber, trackingToken: data.trackingToken, customerEmail: data.order.customer.email };
      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(successState));
      clearCart();
      navigate("/order/success", { replace: true, state: successState });
    },
  });

  function onSubmit(values: CheckoutFormValues) {
    if (items.length === 0) return;
    orderMutation.mutate({
      customer: values.customer,
      shippingAddress: { ...values.shippingAddress, addressLine2: values.shippingAddress.addressLine2?.trim() || undefined },
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      couponCode: appliedCoupon ? appliedCoupon.code : undefined, // Pass valid coupon only
    });
  }

  const serverError = orderMutation.error instanceof ApiClientError ? orderMutation.error.message : orderMutation.error ? "Error placing order." : null;

  if (items.length === 0) {
    return <div className="bg-background py-24 text-center min-h-[60vh]"><h1 className="font-display text-4xl text-text">Nothing to checkout</h1><Link to="/shop" className="mt-6 inline-flex text-[11px] font-bold uppercase tracking-[0.2em] text-rose-dark underline">Return to Shop</Link></div>;
  }

  return (
    <div className="bg-background pb-24 pt-12 md:pt-20">
      <div className="page-container max-w-5xl">
        <div className="mb-10 border-b border-border pb-8">
          <Link to="/cart" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary hover:text-text"><ArrowLeft className="h-3 w-3" /> Back to Cart</Link>
          <h1 className="mt-4 font-display text-4xl text-text md:text-5xl">Secure Checkout</h1>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_400px] items-start">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {serverError && <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{serverError}</div>}
            
            <div>
              <h2 className="font-display text-2xl text-text mb-6">Contact Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><Input label="Full Name" {...register("customer.name")} error={errors.customer?.name?.message} /></div>
                <Input label="Email" type="email" {...register("customer.email")} error={errors.customer?.email?.message} />
                <Input label="Phone" type="tel" {...register("customer.phone")} error={errors.customer?.phone?.message} />
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl text-text mb-6">Shipping Address</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><Input label="Address Line 1" {...register("shippingAddress.addressLine1")} error={errors.shippingAddress?.addressLine1?.message} /></div>
                <div className="sm:col-span-2"><Input label="Address Line 2 (Optional)" {...register("shippingAddress.addressLine2")} /></div>
                <Input label="City" {...register("shippingAddress.city")} error={errors.shippingAddress?.city?.message} />
                <Input label="State / Region" {...register("shippingAddress.stateOrRegion")} error={errors.shippingAddress?.stateOrRegion?.message} />
                <Input label="Postal Code" {...register("shippingAddress.postalCode")} error={errors.shippingAddress?.postalCode?.message} />
                <Input label="Country" {...register("shippingAddress.country")} error={errors.shippingAddress?.country?.message} />
              </div>
            </div>

            <button type="submit" disabled={orderMutation.isPending} className="flex h-[52px] w-full items-center justify-center bg-rose-dark text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-rose transition-colors disabled:opacity-50">
              {orderMutation.isPending ? "Processing..." : `Place Order — ${formatCurrency(subtotal)}`}
            </button>
          </form>

          <div className="bg-cream p-6 sm:p-8 sticky top-28">
            <h2 className="font-display text-2xl text-text border-b border-border pb-4">In Your Order</h2>
            <ul className="mt-4 space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {items.map((i) => (
                <li key={i.productId} className="flex gap-4">
                  <div className="h-16 w-12 shrink-0 bg-background"><img src={i.image} alt={i.name} className="h-full w-full object-cover" /></div>
                  <div className="flex-1"><p className="text-sm text-text font-medium line-clamp-1">{i.name}</p><p className="text-[10px] uppercase tracking-wider text-text-secondary mt-0.5">Qty: {i.quantity}</p></div>
                  <p className="text-sm tabular-nums text-text">{formatCurrency(i.unitPrice * i.quantity)}</p>
                </li>
              ))}
            </ul>

            {/* Coupon Section */}
            <div className="mt-6 border-t border-border pt-6">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Discount code" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="h-10 flex-1 border border-border bg-background px-3 text-sm focus:border-rose-dark focus:outline-none uppercase"
                />
                <button 
                  onClick={() => couponMutation.mutate(couponCode)}
                  disabled={!couponCode || couponMutation.isPending}
                  className="bg-rose-dark px-4 text-[10px] font-bold uppercase tracking-wider text-white disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-xs text-rose mt-2">{couponError}</p>}
              {appliedCoupon && (
                <div className="mt-3 flex items-center justify-between bg-success/10 border border-success/20 p-2 text-success text-xs font-bold uppercase">
                  <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {appliedCoupon.code} applied</span>
                  <button onClick={() => setAppliedCoupon(null)} className="text-success hover:text-rose"><X className="h-3 w-3" /></button>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-border pt-4 flex justify-between items-baseline">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-text">Total</span>
              <span className="font-display text-2xl text-text">{formatCurrency(subtotal)}</span>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-text-secondary bg-background py-3"><Lock className="h-3 w-3" /> Secure Guest Checkout</div>
          </div>
        </div>
      </div>
    </div>
  );
}
