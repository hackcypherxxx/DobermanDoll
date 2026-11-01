import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  src?: string;
  alt: string;
  className?: string;
  fit?: "cover" | "contain";
  priority?: boolean;
}

export function ImageWithFallback({
  src,
  alt,
  className,
  fit = "cover",
  priority = false,
}: Props) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-cream text-[10px] uppercase tracking-[0.2em] text-text-secondary/50",
          className
        )}
        role="img"
        aria-label={alt}
      >
        Image unavailable
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      onError={() => setErrored(true)}
      className={cn(
        fit === "cover" ? "object-cover" : "object-contain",
        className
      )}
    />
  );
}
