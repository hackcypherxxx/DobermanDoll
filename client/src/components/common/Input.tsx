import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends ComponentProps<"input"> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className,
  id,
  name,
  ...props
}: InputProps) {
  const inputId = id ?? name;
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[10px] uppercase tracking-[0.18em] text-text-secondary"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error && inputId ? `${inputId}-error` : undefined}
        className={cn(
          "h-11 w-full border border-border bg-surface px-3 text-sm text-text placeholder:text-text-secondary/50 focus:border-rose focus:outline-none",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p
          id={inputId ? `${inputId}-error` : undefined}
          role="alert"
          className="text-xs text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
