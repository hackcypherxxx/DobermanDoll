import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminListReviews, adminApproveReview, adminDeleteReview } from "@/api/admin";
import { CheckCircle2, Trash2, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: adminListReviews,
  });

  const approveMutation = useMutation({
    mutationFn: adminApproveReview,
    onSuccess: () => {
      // 1. Refresh the admin list
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      // 2. CRITICAL: Refresh the public frontend cache so the review appears immediately!
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });

  if (isLoading) return <div className="p-8 text-center text-text-secondary animate-pulse">Loading reviews...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl text-text">Customer Reviews</h1>
        <p className="text-sm text-text-secondary mt-1">Approve or delete customer feedback.</p>
      </div>

      <div className="border border-border bg-surface">
        <ul className="divide-y divide-border">
          {(reviews ?? []).map((review) => (
            <li key={review._id} className="p-5 flex flex-col sm:flex-row justify-between gap-4 hover:bg-cream/30 transition-colors">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <div className="flex text-rose">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-rose" : "fill-transparent opacity-30"}`} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-text">{review.customerName}</span>
                  <span className="text-[10px] text-text-secondary">{formatDate(review.createdAt)}</span>
                  {review.isApproved ? (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-success bg-success/10 px-2 py-0.5">Approved</span>
                  ) : (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-rose bg-rose/10 px-2 py-0.5">Pending</span>
                  )}
                </div>
                <p className="text-sm text-text-secondary italic">&ldquo;{review.comment}&rdquo;</p>
              </div>

              <div className="flex items-start gap-2 shrink-0">
                {!review.isApproved && (
                  <button 
                    onClick={() => approveMutation.mutate(review._id)} 
                    disabled={approveMutation.isPending}
                    className="flex items-center gap-1 bg-success px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-3 w-3" /> Approve
                  </button>
                )}
                <button 
                  onClick={() => { if(confirm("Delete this review?")) deleteMutation.mutate(review._id); }} 
                  className="p-2 text-text-secondary hover:text-rose transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
          {reviews?.length === 0 && <li className="p-8 text-center text-text-secondary">No reviews yet.</li>}
        </ul>
      </div>
    </div>
  );
}
