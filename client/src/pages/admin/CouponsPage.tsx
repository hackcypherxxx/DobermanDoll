import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminListCoupons, adminCreateCoupon, adminDeleteCoupon } from "@/api/admin";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { formatDate } from "@/lib/utils";
import type { DiscountType } from "@/types/api";

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE" as DiscountType,
    discountValue: 10,
    minPurchaseAmount: 0,
    maxUses: 100,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: adminListCoupons,
  });

  const createMutation = useMutation({
    mutationFn: adminCreateCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      setIsModalOpen(false);
      setFormData({ ...formData, code: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteCoupon,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-coupons"] }),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    createMutation.mutate({ ...formData, isActive: true });
  }

  if (isLoading) {
    return <div className="p-8 text-center text-text-secondary animate-pulse">Loading coupons...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl text-text">Discount Codes</h1>
          <p className="text-sm text-text-secondary mt-1">Manage promotional coupon codes.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-rose-dark px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-rose transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="h-4 w-4" /> Create Coupon
        </button>
      </div>

      <div className="border border-border bg-surface overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-cream/50 text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">
            <tr>
              <th className="p-4">Code</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Min. Spend</th>
              <th className="p-4">Uses</th>
              <th className="p-4">Expires</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(coupons ?? []).map((coupon) => (
              <tr key={coupon._id} className="hover:bg-cream/30">
                <td className="p-4 font-bold text-text">{coupon.code}</td>
                <td className="p-4">
                  {coupon.discountType === "PERCENTAGE"
                    ? `${coupon.discountValue}%`
                    : `$${coupon.discountValue}`}
                </td>
                <td className="p-4">${coupon.minPurchaseAmount}</td>
                <td className="p-4">{coupon.uses} / {coupon.maxUses}</td>
                <td className="p-4">{formatDate(coupon.expiresAt)}</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      if (confirm("Delete this coupon?")) deleteMutation.mutate(coupon._id);
                    }}
                    className="p-2 text-text-secondary hover:text-rose transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {coupons?.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-text-secondary">
                  No coupons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Coupon">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Coupon Code"
            required
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder="e.g. SUMMER20"
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as DiscountType })}
                className="h-11 border border-border px-3 text-sm"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount ($)</option>
              </select>
            </div>
            <Input
              label="Value"
              type="number"
              required
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min. Purchase ($)"
              type="number"
              required
              value={formData.minPurchaseAmount}
              onChange={(e) => setFormData({ ...formData, minPurchaseAmount: Number(e.target.value) })}
            />
            <Input
              label="Max Uses"
              type="number"
              required
              value={formData.maxUses}
              onChange={(e) => setFormData({ ...formData, maxUses: Number(e.target.value) })}
            />
          </div>
          <Input
            label="Expiry Date"
            type="date"
            required
            value={formData.expiresAt}
            onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
          />

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full bg-rose-dark py-3 text-[11px] font-bold uppercase tracking-wider text-white mt-4 disabled:opacity-50"
          >
            {createMutation.isPending ? "Creating..." : "Create Coupon"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
