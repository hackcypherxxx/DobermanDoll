import { useState } from "react";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/api";

interface Props {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = images[activeIdx] ?? images[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream">
        <ImageWithFallback
          src={active?.url}
          alt={active?.alt || productName}
          className="h-full w-full"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={`${img.cloudinaryPublicId}-${i}`}
              onClick={() => setActiveIdx(i)}
              className={cn(
                "h-24 w-20 flex-shrink-0 overflow-hidden border transition-colors",
                i === activeIdx
                  ? "border-text"
                  : "border-transparent hover:border-border"
              )}
              aria-label={`View image ${i + 1} of ${images.length}`}
              aria-current={i === activeIdx}
            >
              <ImageWithFallback
                src={img.url}
                alt={img.alt || `${productName} — image ${i + 1}`}
                className="h-full w-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
