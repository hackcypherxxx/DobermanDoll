import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Minus, Plus, ShieldCheck, Truck, RotateCcw, AlertCircle, Star, CheckCircle2 } from "lucide-react";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductCard } from "@/components/products/ProductCard";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/stores/cartStore";
import { listProductReviews, createProductReview } from "@/api/reviews";
import { convertAndFormatCurrency, formatDate, cn, type CurrencyCode } from "@/lib/utils";
import type { Product } from "@/types/api";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const query = useProduct(slug ?? "");

  useEffect(() => {
    if (query.data) document.title = `${query.data.name} · Dreambaby Silicone Nursery`;
    return () => { document.title = "Dreambaby Silicone Nursery"; };
  }, [query.data]);

  if (query.isLoading) return <ProductSkeleton />;
  if (query.isError || !query.data) return <ProductNotFound />;

  return <ProductDetail product={query.data} />;
}

function ProductDetail({ product }: { product: Product }) {
  const addToCart = useCartStore((s) => s.add);
  
  // Correctly access the array object
  const primaryImage = product.images && product.images.length > 0 ? product.images[0] : null;

  const categoryName = typeof product.category === "object" ? product.category.name : "Shop All";
  const isSoldOut = product.inventoryType === "IN_STOCK" && product.stock <= 0;
  const maxQty = product.inventoryType === "IN_STOCK" ? Math.max(1, product.stock) : 20;
  const hasCompareAt = typeof product.compareAtPrice === "number" && product.compareAtPrice > product.price;
  const lowStock = product.inventoryType === "IN_STOCK" && product.stock > 0 && product.stock < 5;

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  function changeQty(delta: number) { setQty((q) => Math.max(1, Math.min(maxQty, q + delta))); }

  function handleAdd() {
    if (isSoldOut) return;
    addToCart({
      productId: product._id, 
      name: product.name, 
      slug: product.slug, 
      image: primaryImage?.url, // Correctly passing string
      sku: product.sku, 
      unitPrice: product.price, 
      stock: product.stock, 
      inventoryType: product.inventoryType,
    }, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="bg-background pb-24 pt-8 md:pt-12">
      <div className="page-container">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">
          <Link to="/" className="hover:text-text transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shop" className="hover:text-text transition-colors">Shop</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-text truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[55fr_45fr] lg:gap-16 xl:gap-24">
          
          {/* Gallery - Passing the full object array */}
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <ProductGallery images={product.images || []} productName={product.name} />
          </div>

          {/* Info */}
          <div className="lg:pt-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose">{categoryName}</p>
            <h1 className="mt-3 font-display text-3xl leading-tight text-text sm:text-4xl md:text-5xl">{product.name}</h1>

            {/* Currency Selector & Price */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Currency:</span>
                {(["USD", "GBP", "EUR"] as CurrencyCode[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={cn(
                      "px-2 py-1 text-[10px] font-bold border transition-colors",
                      currency === c ? "border-rose-dark bg-rose-dark text-white" : "border-border text-text-secondary hover:border-text"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-medium tabular-nums text-text">
                  {convertAndFormatCurrency(product.price, currency)}
                </span>
                {hasCompareAt && (
                  <span className="text-sm tabular-nums text-text-secondary line-through">
                    {convertAndFormatCurrency(product.compareAtPrice!, currency)}
                  </span>
                )}
              </div>
            </div>

            {product.shortDescription && <p className="mt-6 text-[15px] leading-relaxed text-text-secondary">{product.shortDescription}</p>}

            <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em]">
              <span className={cn("h-1.5 w-1.5 rounded-full", isSoldOut ? "bg-text-secondary" : lowStock ? "bg-rose" : "bg-success")} />
              <span className={isSoldOut ? "text-text-secondary" : "text-text"}>
                {isSoldOut ? "Sold Out" : product.inventoryType === "MADE_TO_ORDER" ? "Made to Order" : product.inventoryType === "PRE_ORDER" ? "Pre-Order" : lowStock ? `Only ${product.stock} left` : "In Stock"}
              </span>
            </div>

            <div className="my-8 h-px w-full bg-border" />

            {isSoldOut ? (
              <div className="flex flex-col items-center justify-center gap-3 border border-border bg-cream/50 px-6 py-8 text-center">
                <AlertCircle className="h-6 w-6 text-text-secondary/50" strokeWidth={1.5} />
                <h3 className="font-display text-2xl text-text">Currently Sold Out</h3>
                <p className="max-w-xs text-sm text-text-secondary">Contact us to be notified when a similar piece becomes available.</p>
                <Link to="/shop" className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-rose-dark underline hover:text-rose">Browse Other Dolls</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
                <div className="flex h-[52px] items-center border border-border">
                  <button onClick={() => changeQty(-1)} disabled={qty <= 1} className="flex h-full w-12 items-center justify-center text-text hover:bg-cream disabled:opacity-30"><Minus className="h-3.5 w-3.5" /></button>
                  <span className="w-10 text-center text-sm font-medium tabular-nums text-text">{qty}</span>
                  <button onClick={() => changeQty(1)} disabled={qty >= maxQty} className="flex h-full w-12 items-center justify-center text-text hover:bg-cream disabled:opacity-30"><Plus className="h-3.5 w-3.5" /></button>
                </div>
                <button onClick={handleAdd} className={cn("h-[52px] flex-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors duration-200", added ? "bg-success" : "bg-rose-dark hover:bg-rose")}>
                  {added ? "Added to Cart" : "Add to Cart"}
                </button>
              </div>
            )}

            <div className="mt-8 grid grid-cols-3 gap-4 border-y border-border py-6 text-center">
              <div className="flex flex-col items-center gap-2"><Truck className="h-5 w-5 text-rose-dark" strokeWidth={1.5} /><span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Secure Shipping</span></div>
              <div className="flex flex-col items-center gap-2"><ShieldCheck className="h-5 w-5 text-rose-dark" strokeWidth={1.5} /><span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Quality Checked</span></div>
              <div className="flex flex-col items-center gap-2"><RotateCcw className="h-5 w-5 text-rose-dark" strokeWidth={1.5} /><span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">14-Day Returns</span></div>
            </div>

            <div className="mt-8 border-t border-border">
              <Accordion title="Full Description" defaultOpen>
                <div className="prose prose-sm md:prose-base prose-neutral max-w-none text-text-secondary" dangerouslySetInnerHTML={{ __html: product.description }} />
              </Accordion>
              <Accordion title="Product Details">
                <div className="grid grid-cols-2 gap-4">
                  <Meta label="SKU" value={product.sku} />
                  <Meta label="Material" value={product.material} />
                  <Meta label="Size" value={product.size} />
                  <Meta label="Weight" value={product.weight} />
                  <Meta label="Presentation" value={product.genderPresentation} />
                  {product.includedAccessories.length > 0 && <div className="col-span-2"><Meta label="Includes" value={product.includedAccessories.join(", ")} /></div>}
                </div>
              </Accordion>
            </div>
          </div>
        </div>

        <ProductReviews productId={product._id} />
        <FeaturedProducts currentId={product._id} />
      </div>
    </div>
  );
}

// ... (Sub-components: ProductReviews, Meta, Accordion, FeaturedProducts, ProductSkeleton, ProductNotFound remain exactly the same as the previous step)
function ProductReviews({ productId }: { productId: string }) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", rating: 5, comment: "" });

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => listProductReviews(productId),
  });

  const mutation = useMutation({
    mutationFn: createProductReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      setSubmitted(true);
      setFormData({ name: "", email: "", rating: 5, comment: "" });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({ ...formData, productId, customerName: formData.name, customerEmail: formData.email, isApproved: false });
  }

  const approved = reviews ? reviews.filter(r => r.isApproved) : [];

  return (
    <div className="mt-24 border-t border-border pt-16">
      <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-text">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-rose">
              {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-rose" />)}
            </div>
            <span className="text-sm text-text-secondary">Based on {approved.length} reviews</span>
          </div>
        </div>
        <button onClick={() => { setIsModalOpen(true); setSubmitted(false); }} className="border border-rose-dark px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-rose-dark hover:bg-rose-dark hover:text-white transition-colors">
          Write a Review
        </button>
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-text-secondary">Loading reviews...</div>
      ) : approved.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {approved.map(r => (
            <div key={r._id} className="border border-border bg-surface p-6">
              <div className="flex text-rose mb-3">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-rose" : "fill-transparent opacity-30"}`} />)}
              </div>
              <p className="font-display text-lg italic text-text">&ldquo;{r.comment}&rdquo;</p>
              <div className="mt-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                <span>{r.customerName}</span>
                <span>{formatDate(r.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-border bg-cream/30 p-12 text-center">
          <p className="font-display text-xl text-text">No reviews yet.</p>
          <p className="text-sm text-text-secondary mt-2">Be the first to share your thoughts on this doll.</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Write a Review">
        {submitted ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="font-display text-2xl text-text">Thank you!</h3>
            <p className="text-sm text-text-secondary mt-2">Your review has been submitted for approval.</p>
            <button onClick={() => setIsModalOpen(false)} className="mt-6 bg-rose-dark text-white px-6 py-2 text-[10px] font-bold uppercase">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <Input label="Email" type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Rating</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(star => (
                  <button key={star} type="button" onClick={() => setFormData({...formData, rating: star})}><Star className={`h-6 w-6 ${star <= formData.rating ? "fill-rose text-rose" : "text-border"}`} /></button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Review</label>
              <textarea required rows={4} value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} className="border border-border p-3 text-sm focus:border-rose-dark focus:outline-none" />
            </div>
            <button type="submit" disabled={mutation.isPending} className="w-full bg-rose-dark py-3 text-[11px] font-bold uppercase text-white disabled:opacity-50">{mutation.isPending ? "Submitting..." : "Submit"}</button>
          </form>
        )}
      </Modal>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return <div><p className="text-[9px] font-bold uppercase tracking-[0.15em] text-text-secondary">{label}</p><p className="mt-1 text-sm text-text">{value || "—"}</p></div>;
}

function Accordion({ title, children, defaultOpen }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="border-b border-border py-5">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left group">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-text group-hover:text-rose-dark transition-colors">{title}</span>
        <span className="relative h-3 w-3 shrink-0"><span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-text" /><span className={`absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-text transition-transform duration-300 ${open ? "rotate-90" : ""}`} /></span>
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}><div className="overflow-hidden text-sm leading-relaxed text-text-secondary">{children}</div></div>
    </div>
  );
}

function FeaturedProducts({ currentId }: { currentId: string }) {
  const { data } = useProducts({ featured: true });
  const featured = (data ?? []).filter(p => p._id !== currentId).slice(0, 4);
  if (!featured.length) return null;
  return (
    <div className="mt-24 border-t border-border pt-16">
      <h2 className="font-display text-3xl text-text text-center mb-12">You May Also Love</h2>
      <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        {featured.map(p => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return <div className="bg-background pb-24 pt-8 md:pt-12"><div className="page-container"><div className="mb-8 h-3 w-48 animate-pulse bg-cream" /><div className="grid gap-10 lg:grid-cols-[55fr_45fr] lg:gap-16"><div className="aspect-[4/5] w-full animate-pulse bg-cream" /><div className="space-y-4"><div className="h-3 w-24 animate-pulse bg-cream" /><div className="h-10 w-3/4 animate-pulse bg-cream" /><div className="h-5 w-32 animate-pulse bg-cream" /></div></div></div></div>;
}

function ProductNotFound() {
  return <div className="bg-background pb-24 pt-12 md:pt-20"><div className="page-container text-center"><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose">404</p><h1 className="mt-4 font-display text-4xl text-text">Doll not found.</h1><Link to="/shop" className="mt-8 inline-flex h-11 items-center bg-rose-dark px-8 text-[10px] font-bold uppercase text-white">Browse Collection</Link></div></div>;
}
