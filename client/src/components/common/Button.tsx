import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-rose text-white hover:bg-rose-dark disabled:bg-rose/60",
  secondary:
    "border border-border bg-transparent text-text hover:border-text/40 hover:bg-cream",
  ghost: "bg-transparent text-text-secondary hover:text-text",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-5 text-[11px]",
  md: "h-11 px-7 text-xs",
  lg: "h-12 px-9 text-xs",
};

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium uppercase tracking-[0.18em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
