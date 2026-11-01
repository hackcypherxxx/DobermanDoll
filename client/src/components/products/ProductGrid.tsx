import { ProductCard } from "./ProductCard";
import type { Product } from "@/types/api";

interface Props {
  products: Product[];
  isLoading?: boolean;
  skeletonCount?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
}

export function ProductGrid({
  products,
  isLoading = false,
  skeletonCount = 8,
  emptyTitle = "Nothing matches your filters",
  emptyDescription = "Try adjusting your search or clearing some filters.",
  emptyAction,
}: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="border border-border bg-cream/40 px-6 py-20 text-center">
        <p className="font-display text-2xl text-text">{emptyTitle}</p>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
          {emptyDescription}
        </p>
        {emptyAction && <div className="mt-6">{emptyAction}</div>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col">
      <div className="aspect-[4/5] w-full animate-pulse bg-cream" />
      <div className="mt-4 h-4 w-2/3 animate-pulse bg-cream" />
      <div className="mt-2 h-3 w-1/3 animate-pulse bg-cream" />
      <div className="mt-4 h-10 animate-pulse border border-border bg-cream/40" />
    </div>
  );
}
