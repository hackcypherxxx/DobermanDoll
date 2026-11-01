import { Link } from "react-router-dom";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { useCartStore } from "@/stores/cartStore";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/api";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const addToCart = useCartStore((s) => s.add);
  
  // Ensure we access the object inside the array correctly
  const primaryImage = product.images && product.images.length > 0 ? product.images[0] : null;

  const isSoldOut = product.inventoryType === "IN_STOCK" && product.stock <= 0;
  const hasCompareAt = typeof product.compareAtPrice === "number" && product.compareAtPrice > product.price;

  function handleAdd() {
    if (isSoldOut) return;
    addToCart({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: primaryImage?.url, // Passing the URL to the cart
      sku: product.sku,
      unitPrice: product.price,
      stock: product.stock,
      inventoryType: product.inventoryType,
    });
  }

  return (
    <div className="group flex flex-col relative">
      <Link to={`/product/${product.slug}`} className="relative block overflow-hidden bg-cream">
        <div className="relative aspect-[4/5] w-full">
          {primaryImage ? (
            <ImageWithFallback
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs text-gray-500">
              No Image
            </div>
          )}
          
          {isSoldOut && (
            <span className="absolute left-3 top-3 bg-surface px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-text">
              Sold Out
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <Link to={`/product/${product.slug}`} className="font-display text-lg leading-tight text-text transition-colors hover:text-rose line-clamp-2">
          {product.name}
        </Link>

        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-medium tabular-nums text-text">
            {formatCurrency(product.price, product.currency)}
          </span>
          {hasCompareAt && (
            <span className="text-xs tabular-nums text-text-secondary line-through">
              {formatCurrency(product.compareAtPrice!, product.currency)}
            </span>
          )}
        </div>

        <div className="mt-4 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
          <button
            onClick={handleAdd}
            disabled={isSoldOut}
            className="h-10 w-full border border-rose-dark bg-transparent text-[10px] font-bold uppercase tracking-[0.18em] text-rose-dark transition-colors hover:bg-rose-dark hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-rose-dark"
          >
            {isSoldOut ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
