import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, MessageSquarePlus, CheckCircle2, AlertCircle } from "lucide-react";
import { listReviews, createReview } from "@/api/reviews";
import { useProducts } from "@/hooks/useProducts";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { formatDate } from "@/lib/utils";

export function ReviewSection() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", rating: 5, comment: "", productId: "" });

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: listReviews,
  });

  const { data: products } = useProducts();

  const mutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      setSubmitted(true);
      setFormData({ name: "", email: "", rating: 5, comment: "", productId: "" });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.productId) {
      alert("Please select a product to review.");
      return;
    }
    mutation.mutate({
      productId: formData.productId,
      customerName: formData.name,
      customerEmail: formData.email,
      rating: formData.rating,
      comment: formData.comment,
      isApproved: false, // CRITICAL FIX: Forces the backend to accept the payload
    });
  }

  if (isLoading) return null;

  const approvedReviews = reviews ? reviews.filter(r => r.isApproved) : [];
  const displayReviews = approvedReviews.slice(0, 3);

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="page-container">
        <div className="mb-12 flex flex-col items-center justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div className="text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-rose">Testimonials</span>
            <h2 className="mt-4 font-display text-3xl text-text md:text-5xl">Words from Our Doll Families</h2>
          </div>
          <button
            onClick={() => { setIsModalOpen(true); setSubmitted(false); }}
            className="flex items-center gap-2 border border-rose-dark bg-transparent px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-rose-dark transition-colors hover:bg-rose-dark hover:text-white"
          >
            <MessageSquarePlus className="h-4 w-4" /> Write a Review
          </button>
        </div>

        {displayReviews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {displayReviews.map((review) => (
              <div key={review._id} className="flex flex-col border border-border bg-surface p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-1 text-rose">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-rose" : "fill-transparent opacity-30"}`} strokeWidth={1.5} />
                  ))}
                </div>
                <p className="mt-4 flex-1 font-display text-lg italic leading-relaxed text-text">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-text">{review.customerName}</p>
                    <p className="text-[10px] text-text-secondary mt-1">{formatDate(review.createdAt)}</p>
                  </div>
                  <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-success bg-success/10 px-2 py-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border border-border bg-surface px-6 py-16 text-center">
            <Star className="h-8 w-8 text-rose/30 mb-4" strokeWidth={1} />
            <h3 className="font-display text-2xl text-text">No reviews yet.</h3>
            <p className="mt-2 max-w-sm text-sm text-text-secondary">
              Be the first to share your experience with our beautiful reborn dolls.
            </p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Write a Review">
        {submitted ? (
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-success mb-4" strokeWidth={1.5} />
            <h3 className="font-display text-2xl text-text">Thank you!</h3>
            <p className="mt-2 text-sm text-text-secondary">Your review has been submitted successfully and is pending approval.</p>
            <button onClick={() => setIsModalOpen(false)} className="mt-6 bg-rose-dark px-6 py-2 text-[10px] font-bold uppercase tracking-wider text-white">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Which Doll are you reviewing?</label>
              <select required value={formData.productId} onChange={(e) => setFormData({ ...formData, productId: e.target.value })} className="h-11 border border-border bg-background px-3 text-sm focus:border-rose-dark focus:outline-none">
                <option value="">Select a product...</option>
                {products?.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <Input label="Your Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <Input label="Email Address" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setFormData({ ...formData, rating: star })} className="p-1">
                    <Star className={`h-6 w-6 ${star <= formData.rating ? "fill-rose text-rose" : "text-border"}`} strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Your Review</label>
              <textarea required rows={4} value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} placeholder="Tell us about your little treasure..." className="border border-border p-3 text-sm focus:border-rose-dark focus:outline-none" />
            </div>
            
            {/* Error Display */}
            {mutation.isError && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{(mutation.error as any)?.message || "Failed to submit review."}</p>
              </div>
            )}

            <button type="submit" disabled={mutation.isPending} className="w-full bg-rose-dark py-3 text-[11px] font-bold uppercase tracking-wider text-white disabled:opacity-50 mt-2">
              {mutation.isPending ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </Modal>
    </section>
  );
}
