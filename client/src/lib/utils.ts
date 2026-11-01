import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Currency Converter
 * Converts a base USD price to GBP or EUR for display purposes.
 */
export type CurrencyCode = "USD" | "GBP" | "EUR";

export function convertAndFormatCurrency(amountUsd: number, targetCurrency: CurrencyCode): string {
  let converted = amountUsd;
  
  // Standard approximate conversion rates
  if (targetCurrency === "GBP") converted = amountUsd * 0.79;
  if (targetCurrency === "EUR") converted = amountUsd * 0.92;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: targetCurrency,
    minimumFractionDigits: 2,
  }).format(converted);
}
