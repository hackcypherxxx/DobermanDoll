import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Truck, FileText, Package, MessageSquare, Receipt } from "lucide-react";
import { 
  adminGetOrder, 
  adminSendPaymentInstructions, 
  adminConfirmPayment, 
  adminShipOrder, 
  adminSendOrderMessage,
  adminResendReceipt
} from "@/api/admin";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState<"payment" | "confirm" | "ship" | "message" | null>(null);

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["admin-order", id],
    queryFn: () => adminGetOrder(id!),
    enabled: !!id,
  });

  // Mutations
  const paymentInstructionsMutation = useMutation({
    mutationFn: (data: { paymentMethod: string, paymentInstructions: string }) => adminSendPaymentInstructions(id!, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-order", id] }); setModalOpen(null); }
  });

  const confirmPaymentMutation = useMutation({
    mutationFn: (ref?: string) => adminConfirmPayment(id!, ref),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["admin-order", id] }); 
      setModalOpen(null); 
      alert("Payment Confirmed! The receipt has been generated and emailed to the customer.");
    }
  });

  const shipMutation = useMutation({
    mutationFn: (data: { carrier: string, trackingNumber: string, trackingUrl?: string }) => adminShipOrder(id!, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-order", id] }); setModalOpen(null); }
  });

  const messageMutation = useMutation({
    mutationFn: (msg: string) => adminSendOrderMessage(id!, msg),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-order", id] }); setModalOpen(null); }
  });

  const resendReceiptMutation = useMutation({
    mutationFn: () => adminResendReceipt(id!),
    onSuccess: () => alert("Receipt email resent successfully."),
    onError: (err: any) => alert(err.message || "Failed to resend receipt.")
  });

  if (isLoading) return <div className="p-8 text-center text-text-secondary animate-pulse">Loading order details...</div>;
  if (isError || !order) return <div className="p-8 text-center text-red-600">Order not found.</div>;

  const isPaid = order.paymentStatus === "PAID";
  const isShipped = order.orderStatus === "SHIPPED" || order.orderStatus === "DELIVERED";

  return (
    <div className="max-w-5xl mx-auto pb-24 lg:pb-0">
      <Link to="/admin/orders" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary hover:text-text mb-6">
        <ArrowLeft className="h-3 w-3" /> Back to Orders
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-text">{order.orderNumber}</h1>
          <p className="text-sm text-text-secondary mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm border ${
            isPaid ? 'border-success text-success bg-success/5' : 
            order.paymentStatus === 'UNPAID' ? 'border-rose text-rose bg-rose/5' : 'border-border text-text-secondary'
          }`}>
            Payment: {order.paymentStatus.replace("_", " ")}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm border border-border text-text-secondary">
            Status: {order.orderStatus.replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_340px] gap-6 items-start">
        
        {/* Left Column: Actions & Items */}
        <div className="space-y-6">
          
          {/* Action Bar (Desktop) */}
          <div className="hidden md:flex flex-wrap gap-3 border border-border bg-surface p-4 shadow-sm">
            {order.paymentStatus === "UNPAID" && (
              <button onClick={() => setModalOpen("payment")} className="flex items-center gap-2 bg-rose-dark px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-rose transition-colors">
                <FileText className="h-3 w-3" /> Send Payment Instructions
              </button>
            )}
            {(order.paymentStatus === "INSTRUCTIONS_SENT" || order.paymentStatus === "PAYMENT_REPORTED" || order.paymentStatus === "UNPAID") && (
              <button onClick={() => setModalOpen("confirm")} className="flex items-center gap-2 bg-success px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-green-700 transition-colors">
                <CheckCircle2 className="h-3 w-3" /> Mark as Paid
              </button>
            )}
            {isPaid && !isShipped && (
              <button onClick={() => setModalOpen("ship")} className="flex items-center gap-2 bg-rose-dark px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-rose transition-colors">
                <Truck className="h-3 w-3" /> Mark as Shipped
              </button>
            )}
            
            <div className="w-px h-8 bg-border mx-1 hidden sm:block"></div>

            <button onClick={() => setModalOpen("message")} className="flex items-center gap-2 border border-border px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-text hover:bg-cream transition-colors">
              <MessageSquare className="h-3 w-3" /> Send Message
            </button>
            
            {isPaid && (
              <button onClick={() => resendReceiptMutation.mutate()} disabled={resendReceiptMutation.isPending} className="flex items-center gap-2 border border-border px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-text hover:bg-cream transition-colors disabled:opacity-50">
                <Receipt className="h-3 w-3" /> Resend Receipt
              </button>
            )}
          </div>

          {/* Items */}
          <div className="border border-border bg-surface">
            <div className="border-b border-border p-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-rose-dark" />
              <h2 className="font-display text-lg text-text">Items</h2>
            </div>
            <ul className="divide-y divide-border">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 p-4">
                  {item.image && <img src={item.image} alt={item.name} className="h-16 w-12 object-cover bg-cream border border-border" />}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text">{item.name}</p>
                    <p className="text-xs text-text-secondary mt-1">Qty: {item.quantity} x {formatCurrency(item.unitPrice)}</p>
                  </div>
                  <p className="text-sm font-medium tabular-nums">{formatCurrency(item.lineTotal)}</p>
                </li>
              ))}
            </ul>
            <div className="border-t border-border p-4 flex justify-between items-center bg-cream/30">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Total</span>
              <span className="font-display text-xl">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Details */}
        <div className="space-y-6">
          <div className="border border-border bg-surface p-5">
            <h2 className="font-display text-lg text-text mb-4 border-b border-border pb-2">Customer</h2>
            <div className="space-y-3 text-sm">
              <div><span className="text-text-secondary block text-[10px] font-bold uppercase tracking-wider">Name</span> {order.customer?.name}</div>
              <div><span className="text-text-secondary block text-[10px] font-bold uppercase tracking-wider">Email</span> {order.customer?.email}</div>
              <div><span className="text-text-secondary block text-[10px] font-bold uppercase tracking-wider">Phone</span> {order.customer?.phone}</div>
            </div>
          </div>

          <div className="border border-border bg-surface p-5">
            <h2 className="font-display text-lg text-text mb-4 border-b border-border pb-2">Shipping Address</h2>
            <address className="not-italic text-sm text-text-secondary leading-relaxed">
              {order.shippingAddress.addressLine1}<br />
              {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
              {order.shippingAddress.city}, {order.shippingAddress.stateOrRegion} {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
            </address>
          </div>

          {order.paymentReference && (
            <div className="border border-border bg-surface p-5">
              <h2 className="font-display text-lg text-text mb-4 border-b border-border pb-2">Payment Info</h2>
              <div className="space-y-3 text-sm">
                <div><span className="text-text-secondary block text-[10px] font-bold uppercase tracking-wider">Reference</span> {order.paymentReference}</div>
                <div><span className="text-text-secondary block text-[10px] font-bold uppercase tracking-wider">Confirmed At</span> {formatDate(order.paymentConfirmedAt)}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sticky Actions */}
      <div className="md:hidden fixed bottom-0 inset-x-0 p-4 bg-surface border-t border-border flex flex-col gap-2 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {order.paymentStatus === "UNPAID" && (
          <button onClick={() => setModalOpen("payment")} className="w-full bg-rose-dark py-3 text-[11px] font-bold uppercase tracking-wider text-white">Send Payment Instructions</button>
        )}
        {(order.paymentStatus === "INSTRUCTIONS_SENT" || order.paymentStatus === "PAYMENT_REPORTED" || order.paymentStatus === "UNPAID") && (
          <button onClick={() => setModalOpen("confirm")} className="w-full bg-success py-3 text-[11px] font-bold uppercase tracking-wider text-white">Mark as Paid</button>
        )}
        {isPaid && !isShipped && (
          <button onClick={() => setModalOpen("ship")} className="w-full bg-rose-dark py-3 text-[11px] font-bold uppercase tracking-wider text-white">Mark as Shipped</button>
        )}
        <div className="flex gap-2 mt-2">
          <button onClick={() => setModalOpen("message")} className="flex-1 border border-border py-3 text-[10px] font-bold uppercase tracking-wider text-text">Message</button>
          {isPaid && (
            <button onClick={() => resendReceiptMutation.mutate()} className="flex-1 border border-border py-3 text-[10px] font-bold uppercase tracking-wider text-text">Receipt</button>
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}
      
      <Modal isOpen={modalOpen === "payment"} onClose={() => setModalOpen(null)} title="Send Payment Instructions">
        <PaymentForm onSubmit={(data) => paymentInstructionsMutation.mutate(data)} isSubmitting={paymentInstructionsMutation.isPending} />
      </Modal>

      <Modal isOpen={modalOpen === "confirm"} onClose={() => setModalOpen(null)} title="Confirm Payment">
        <ConfirmPaymentForm onSubmit={(ref) => confirmPaymentMutation.mutate(ref)} isSubmitting={confirmPaymentMutation.isPending} />
      </Modal>

      <Modal isOpen={modalOpen === "ship"} onClose={() => setModalOpen(null)} title="Mark as Shipped">
        <ShipForm onSubmit={(data) => shipMutation.mutate(data)} isSubmitting={shipMutation.isPending} />
      </Modal>

      <Modal isOpen={modalOpen === "message"} onClose={() => setModalOpen(null)} title="Send Custom Message">
        <MessageForm onSubmit={(msg) => messageMutation.mutate(msg)} isSubmitting={messageMutation.isPending} />
      </Modal>
    </div>
  );
}

// ==========================================
// INLINE FORMS FOR MODALS
// ==========================================

function PaymentForm({ onSubmit, isSubmitting }: { onSubmit: (d: any) => void, isSubmitting: boolean }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); onSubmit({ paymentMethod: fd.get("method"), paymentInstructions: fd.get("instructions") }); }} className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Payment Method</label>
        <select name="method" required className="h-11 border border-border bg-background px-3 text-sm focus:border-rose-dark focus:outline-none">
          <option value="">Select method...</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Zelle">Zelle</option>
          <option value="CashApp">CashApp</option>
          <option value="PayPal">PayPal</option>
          <option value="Crypto">Crypto</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Instructions for Customer</label>
        <textarea name="instructions" rows={4} required placeholder="Please send $X to..." className="border border-border p-3 text-sm focus:border-rose-dark focus:outline-none" />
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full bg-rose-dark py-3 text-[11px] font-bold uppercase tracking-wider text-white disabled:opacity-50">
        {isSubmitting ? "Sending..." : "Send Instructions"}
      </button>
    </form>
  );
}

function ConfirmPaymentForm({ onSubmit, isSubmitting }: { onSubmit: (ref?: string) => void, isSubmitting: boolean }) {
  const [ref, setRef] = useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(ref.trim() || undefined); }} className="space-y-4">
      <div className="bg-success/10 border border-success/20 p-4 mb-4">
        <p className="text-sm text-success font-medium">This will mark the order as <strong>PAID</strong>, generate a PDF receipt, and email it to the customer.</p>
      </div>
      <Input 
        label="Payment Reference (Optional)" 
        placeholder="e.g. TXN-123456, Zelle ID, etc." 
        value={ref}
        onChange={(e) => setRef(e.target.value)}
      />
      <button type="submit" disabled={isSubmitting} className="w-full bg-success py-3 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-green-700 transition-colors disabled:opacity-50 mt-2">
        {isSubmitting ? "Confirming..." : "Yes, Confirm Payment"}
      </button>
    </form>
  );
}

function ShipForm({ onSubmit, isSubmitting }: { onSubmit: (d: any) => void, isSubmitting: boolean }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); onSubmit({ carrier: fd.get("carrier"), trackingNumber: fd.get("tracking"), trackingUrl: fd.get("url") || undefined }); }} className="space-y-4">
      <Input label="Carrier" name="carrier" placeholder="e.g. FedEx, UPS, DHL" required />
      <Input label="Tracking Number" name="tracking" placeholder="123456789" required />
      <Input label="Tracking URL (Optional)" name="url" type="url" placeholder="https://..." />
      <button type="submit" disabled={isSubmitting} className="w-full bg-rose-dark py-3 text-[11px] font-bold uppercase tracking-wider text-white disabled:opacity-50">
        {isSubmitting ? "Saving..." : "Confirm Shipment"}
      </button>
    </form>
  );
}

function MessageForm({ onSubmit, isSubmitting }: { onSubmit: (msg: string) => void, isSubmitting: boolean }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); onSubmit(fd.get("message") as string); }} className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Message to Customer</label>
        <textarea name="message" rows={5} required placeholder="Type your message here..." className="border border-border p-3 text-sm focus:border-rose-dark focus:outline-none" />
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full bg-rose-dark py-3 text-[11px] font-bold uppercase tracking-wider text-white disabled:opacity-50">
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
