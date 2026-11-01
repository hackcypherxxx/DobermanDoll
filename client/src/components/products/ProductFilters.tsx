import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category, InventoryType } from "@/types/api";

export interface FilterState {
  q: string;
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  availability: InventoryType[];
  sort:
    | "featured"
    | "newest"
    | "price-asc"
    | "price-desc"
    | "name";
  preset: "featured" | "bestSeller" | "newArrival" | null;
}

interface Props {
  filters: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onClearAll: () => void;
  categories: Category[];
  categoryCounts: Record<string, number>;
  totalCount: number;
  priceBounds: { min: number; max: number };
  hasActiveFilters: boolean;
}

const AVAILABILITY_OPTIONS: { value: InventoryType; label: string }[] = [
  { value: "IN_STOCK", label: "In Stock" },
  { value: "MADE_TO_ORDER", label: "Made to Order" },
  { value: "PRE_ORDER", label: "Pre-Order" },
];

export function ProductFilters({
  filters,
  onChange,
  onClearAll,
  categories,
  categoryCounts,
  totalCount,
  priceBounds,
  hasActiveFilters,
}: Props) {
  function toggleAvailability(type: InventoryType) {
    const next = filters.availability.includes(type)
      ? filters.availability.filter((t) => t !== type)
      : [...filters.availability, type];
    onChange({ availability: next });
  }

  function setPrice(
    field: "minPrice" | "maxPrice",
    raw: string
  ) {
    const n = raw.trim() === "" ? null : Number(raw);
    onChange({ [field]: Number.isFinite(n) && n !== null ? n : null });
  }

  return (
    <div className="space-y-10">
      {/* Search (only shown when active) */}
      {filters.q && (
        <div>
          <FilterLabel>Search</FilterLabel>
          <div className="mt-3 flex items-center justify-between gap-2 border border-border bg-surface px-3 py-2">
            <span className="truncate text-sm text-text">{filters.q}</span>
            <button
              onClick={() => onChange({ q: "" })}
              className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-text-secondary hover:text-text"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Category */}
      <div>
        <FilterLabel>Category</FilterLabel>
        <ul className="mt-3 space-y-0.5">
          <li>
            <button
              onClick={() => onChange({ category: null })}
              className={cn(
                "flex w-full items-center justify-between py-2 text-sm transition-colors",
                filters.category === null
                  ? "text-text"
                  : "text-text-secondary hover:text-text"
              )}
            >
              <span>All dolls</span>
              <span className="text-[11px] tabular-nums text-text-secondary">
                {totalCount}
              </span>
            </button>
          </li>
          {categories.map((c) => {
            const count = categoryCounts[c._id] ?? 0;
            const selected = filters.category === c._id;
            return (
              <li key={c._id}>
                <button
                  onClick={() => onChange({ category: c._id })}
                  className={cn(
                    "flex w-full items-center justify-between py-2 text-sm transition-colors",
                    selected
                      ? "text-text"
                      : "text-text-secondary hover:text-text"
                  )}
                >
                  <span className="truncate pr-2 text-left">{c.name}</span>
                  <span className="shrink-0 text-[11px] tabular-nums text-text-secondary">
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price */}
      <div>
        <FilterLabel>Price</FilterLabel>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            min={priceBounds.min}
            max={priceBounds.max}
            placeholder={`$${priceBounds.min}`}
            value={filters.minPrice ?? ""}
            onChange={(e) => setPrice("minPrice", e.target.value)}
            className="h-10 w-full border border-border bg-surface px-2 text-sm text-text placeholder:text-text-secondary/50 focus:border-rose focus:outline-none"
            aria-label="Minimum price"
          />
          <span className="text-text-secondary">—</span>
          <input
            type="number"
            inputMode="decimal"
            min={priceBounds.min}
            max={priceBounds.max}
            placeholder={`$${priceBounds.max}`}
            value={filters.maxPrice ?? ""}
            onChange={(e) => setPrice("maxPrice", e.target.value)}
            className="h-10 w-full border border-border bg-surface px-2 text-sm text-text placeholder:text-text-secondary/50 focus:border-rose focus:outline-none"
            aria-label="Maximum price"
          />
        </div>
      </div>

      {/* Availability */}
      <div>
        <FilterLabel>Availability</FilterLabel>
        <ul className="mt-3 space-y-2">
          {AVAILABILITY_OPTIONS.map((opt) => {
            const checked = filters.availability.includes(opt.value);
            return (
              <li key={opt.value}>
                <button
                  onClick={() => toggleAvailability(opt.value)}
                  className="flex w-full items-center gap-3 py-1 text-left"
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center border transition-colors",
                      checked
                        ? "border-rose bg-rose"
                        : "border-border bg-surface"
                    )}
                    aria-hidden
                  >
                    {checked && (
                      <Check
                        className="h-2.5 w-2.5 text-white"
                        strokeWidth={3}
                      />
                    )}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {opt.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          onClick={onClearAll}
          className="text-[10px] uppercase tracking-[0.2em] text-text-secondary underline-offset-4 transition-colors hover:text-text hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-text">
      {children}
    </p>
  );
}
