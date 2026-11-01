import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div>
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-text-secondary/50" />
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-text-secondary">
            {eyebrow}
          </p>
        </div>
        <h2 className="mt-5 font-display text-4xl leading-[1.05] text-text sm:text-5xl md:text-6xl">
          {title}
        </h2>
      </div>

      {(description || action) && (
        <div className="flex flex-col items-start gap-4 md:items-end">
          {description && (
            <p className="max-w-sm text-sm leading-relaxed text-text-secondary md:text-right">
              {description}
            </p>
          )}
          {action}
        </div>
      )}
    </div>
  );
}
