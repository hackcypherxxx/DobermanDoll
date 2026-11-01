import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center bg-blush-light px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-rose-dark",
        className
      )}
      {...props}
    />
  );
}
