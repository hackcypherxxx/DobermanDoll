import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import type { InventoryType, Product } from "@/types/api";

const AVAILABILITIES: InventoryType[] = ["IN_STOCK", "MADE_TO_ORDER", "PRE_ORDER"];
const SORTS = ["featured", "newest", "price-asc", "price-desc", "name"] as const;
type SortOption = typeof SORTS[number];

// High-end editorial imagery for the shop hero
const SHOP_HERO_IMAGE = "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=2000&auto=format&fit=crop";

interface FilterState {
  q: string;
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  availability: InventoryType[];
  sort: SortOption;
  preset: "featured" | "bestSeller" | "newArrival" | null;
}

export default function ShopPage() {
  const [params, setParams] = useSearchParams();
  const productsQuery = useProducts();
  const categoriesQuery = useCategories();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters = useMemo(() => filtersFromParams(params), [params]);
  const allProducts = productsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const categoryCounts = useMemo(() => countByCategory(allProducts), [allProducts]);
  const priceBounds = useMemo(() => priceRange(allProducts), [allProducts]);

  const filtered = useMemo(() => applyFilters(allProducts, filters), [allProducts, filters]);
  const sorted = useMemo(() => applySort(filtered, filters.sort), [filtered, filters.sort]);

  const hasActiveFilters = isFilterActive(filters);
  const activeCount = countActive(filters);

  function updateFilters(patch: Partial<FilterState>) {
    const next: FilterState = { ...filters, ...patch };
    setParams(buildParams(next), { replace: true });
  }

  function clearAll() {
    setParams(new URLSearchParams(), { replace: true });
  }

  // Close drawer on escape
  useEffect(() => {
    if (!filtersOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFiltersOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtersOpen]);

  return (
    <div className="bg-background pb-24">
      
      {/* ==================== SHOP HERO ==================== */}
      <section className="relative h-[300px] w-full overflow-hidden bg-cream md:h-[400px] lg:h-[450px]">
        <img 
          src={SHOP_HERO_IMAGE} 
          alt="Shop Collection" 
          className="h-full w-full object-cover object-center" 
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/90">
            The Boutique
          </span>
          <h1 className="mt-3 font-display text-4xl text-white md:text-5xl lg:text-6xl">
            Shop All Dolls
          </h1>
        </div>
      </section>

      {/* ==================== META BAR (Count & Sort) ==================== */}
      <div className="border-b border-border bg-surface">
        <div className="page-container flex h-16 items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-secondary">
            {productsQuery.isLoading ? "Loading…" : `${sorted.length} ${sorted.length === 1 ? "Doll" : "Dolls"}`}
          </span>
          
          {/* Desktop Sort */}
          <div className="relative hidden md:block">
            <select
              value={filters.sort}
              onChange={(e) => updateFilters({ sort: e.target.value as SortOption })}
              className="h-10 appearance-none border-b border-transparent bg-transparent pr-6 text-[11px] font-bold uppercase tracking-[0.15em] text-text transition-colors hover:border-text focus:outline-none cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="newest">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A–Z</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text" />
          </div>

          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-text md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
            Filters
            {activeCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-rose px-1 text-[9px] text-white">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ==================== MAIN CONTENT (Grid & Sidebar) ==================== */}
      <div className="page-container mt-10 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14 md:mt-14">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <FilterContent
              filters={filters}
              categories={categories}
              categoryCounts={categoryCounts}
              priceBounds={priceBounds}
              totalCount={allProducts.length}
              onChange={updateFilters}
              onClearAll={clearAll}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </aside>

        {/* Product Grid */}
        <div>
          <ProductGrid
            products={sorted}
            isLoading={productsQuery.isLoading}
            skeletonCount={9}
            emptyTitle="Nothing matches these filters"
            emptyDescription="Try clearing some filters or searching for a different term."
            emptyAction={
              hasActiveFilters ? (
                <button
                  onClick={clearAll}
                  className="mt-6 inline-flex h-11 items-center border border-rose-dark px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-dark transition-colors hover:bg-rose-dark hover:text-white"
                >
                  Clear all filters
                </button>
              ) : null
            }
          />
        </div>
      </div>

      {/* ==================== MOBILE FILTER DRAWER ==================== */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[90%] max-w-sm flex-col bg-surface shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <span className="font-display text-2xl text-text">Filters</span>
              <button onClick={() => setFiltersOpen(false)} className="p-2 -mr-2">
                <X className="h-5 w-5 text-text" strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <FilterContent
                filters={filters}
                categories={categories}
                categoryCounts={categoryCounts}
                priceBounds={priceBounds}
                totalCount={allProducts.length}
                onChange={updateFilters}
                onClearAll={clearAll}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
            <div className="border-t border-border p-6">
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-full bg-rose-dark py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-rose"
              >
                Show {sorted.length} {sorted.length === 1 ? "Doll" : "Dolls"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// FILTER CONTENT COMPONENT
// ==========================================
function FilterContent({
  filters, categories, categoryCounts, priceBounds, totalCount, onChange, onClearAll, hasActiveFilters
}: any) {
  function setPrice(field: "minPrice" | "maxPrice", raw: string) {
    const n = raw.trim() === "" ? null : Number(raw);
    onChange({ [field]: Number.isFinite(n) && n !== null ? n : null });
  }

  function toggleAvailability(type: InventoryType) {
    const next = filters.availability.includes(type)
      ? filters.availability.filter((t: InventoryType) => t !== type)
      : [...filters.availability, type];
    onChange({ availability: next });
  }

  return (
    <div className="space-y-8">
      {filters.q && (
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-text">Search</p>
          <div className="flex items-center justify-between border border-border bg-background px-3 py-2">
            <span className="text-sm text-text truncate">{filters.q}</span>
            <button onClick={() => onChange({ q: "" })} className="text-[10px] uppercase text-text-secondary hover:text-rose">Clear</button>
          </div>
        </div>
      )}

      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-text">Category</p>
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => onChange({ category: null })}
              className={`flex w-full justify-between text-sm transition-colors ${filters.category === null ? "text-rose font-medium" : "text-text-secondary hover:text-text"}`}
            >
              <span>All Dolls</span>
              <span className="text-text-secondary/50">{totalCount}</span>
            </button>
          </li>
          {categories.map((c: any) => (
            <li key={c._id}>
              <button
                onClick={() => onChange({ category: c._id })}
                className={`flex w-full justify-between text-sm transition-colors ${filters.category === c._id ? "text-rose font-medium" : "text-text-secondary hover:text-text"}`}
              >
                <span className="truncate pr-2 text-left">{c.name}</span>
                <span className="text-text-secondary/50">{categoryCounts[c._id] || 0}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-text">Price</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={`$${priceBounds.min}`}
            value={filters.minPrice ?? ""}
            onChange={(e) => setPrice("minPrice", e.target.value)}
            className="h-10 w-full border border-border bg-background px-3 text-sm text-text placeholder:text-text-secondary/50 focus:border-rose-dark focus:outline-none"
          />
          <span className="text-text-secondary">—</span>
          <input
            type="number"
            placeholder={`$${priceBounds.max}`}
            value={filters.maxPrice ?? ""}
            onChange={(e) => setPrice("maxPrice", e.target.value)}
            className="h-10 w-full border border-border bg-background px-3 text-sm text-text placeholder:text-text-secondary/50 focus:border-rose-dark focus:outline-none"
          />
        </div>
      </div>

      <div>
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-text">Availability</p>
        <ul className="space-y-3">
          {(["IN_STOCK", "MADE_TO_ORDER", "PRE_ORDER"] as InventoryType[]).map((type) => {
            const checked = filters.availability.includes(type);
            const label = type === "IN_STOCK" ? "In Stock" : type === "MADE_TO_ORDER" ? "Made to Order" : "Pre-Order";
            return (
              <li key={type}>
                <button onClick={() => toggleAvailability(type)} className="flex w-full items-center gap-3">
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${checked ? "border-rose-dark bg-rose-dark" : "border-border bg-background"}`}>
                    {checked && <X className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                  </span>
                  <span className={`text-sm ${checked ? "text-text" : "text-text-secondary"}`}>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {hasActiveFilters && (
        <button onClick={onClearAll} className="mt-4 text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary underline hover:text-rose">
          Clear All Filters
        </button>
      )}
    </div>
  );
}

// ==========================================
// LOGIC HELPERS
// ==========================================
function filtersFromParams(params: URLSearchParams): FilterState {
  return {
    q: params.get("q") ?? "",
    category: params.get("category"),
    minPrice: toNumber(params.get("min")),
    maxPrice: toNumber(params.get("max")),
    availability: parseAvailability(params.get("availability")),
    sort: (SORTS.includes(params.get("sort") as SortOption) ? params.get("sort") : "featured") as SortOption,
    preset: getPreset(params),
  };
}

function buildParams(filters: FilterState): URLSearchParams {
  const sp = new URLSearchParams();
  if (filters.q) sp.set("q", filters.q);
  if (filters.category) sp.set("category", filters.category);
  if (filters.minPrice != null) sp.set("min", String(filters.minPrice));
  if (filters.maxPrice != null) sp.set("max", String(filters.maxPrice));
  if (filters.availability.length > 0) sp.set("availability", filters.availability.join(","));
  if (filters.sort !== "featured") sp.set("sort", filters.sort);
  if (filters.preset) sp.set(filters.preset, "true");
  return sp;
}

function toNumber(v: string | null): number | null {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseAvailability(v: string | null): InventoryType[] {
  if (!v) return [];
  return v.split(",").map((s) => s.trim()).filter((s): s is InventoryType => AVAILABILITIES.includes(s as InventoryType));
}

function getPreset(params: URLSearchParams): FilterState["preset"] {
  if (params.get("featured") === "true") return "featured";
  if (params.get("bestSeller") === "true") return "bestSeller";
  if (params.get("newArrival") === "true") return "newArrival";
  return null;
}

function isFilterActive(f: FilterState): boolean {
  return Boolean(f.q) || f.category !== null || f.minPrice !== null || f.maxPrice !== null || f.availability.length > 0 || f.preset !== null;
}

function countActive(f: FilterState): number {
  return [Boolean(f.q), f.category !== null, f.minPrice !== null, f.maxPrice !== null, f.availability.length > 0, f.preset !== null].filter(Boolean).length;
}

function categoryIdOf(p: Product): string {
  return typeof p.category === "string" ? p.category : p.category._id;
}

function countByCategory(products: Product[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of products) {
    const id = categoryIdOf(p);
    counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}

function priceRange(products: Product[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 500 };
  let min = Infinity;
  let max = -Infinity;
  for (const p of products) {
    if (p.price < min) min = p.price;
    if (p.price > max) max = p.price;
  }
  return { min: Math.floor(min), max: Math.ceil(max) };
}

function applyFilters(products: Product[], f: FilterState): Product[] {
  const q = f.q.trim().toLowerCase();
  return products.filter((p) => {
    if (q) {
      const haystack = `${p.name} ${p.sku} ${p.shortDescription} ${p.tags.join(" ")}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (f.category !== null && categoryIdOf(p) !== f.category) return false;
    if (f.minPrice != null && p.price < f.minPrice) return false;
    if (f.maxPrice != null && p.price > f.maxPrice) return false;
    if (f.availability.length > 0 && !f.availability.includes(p.inventoryType)) return false;
    if (f.preset === "featured" && !p.isFeatured) return false;
    if (f.preset === "bestSeller" && !p.isBestSeller) return false;
    if (f.preset === "newArrival" && !p.isNewArrival) return false;
    return true;
  });
}

function applySort(products: Product[], sort: SortOption): Product[] {
  const arr = [...products];
  switch (sort) {
    case "price-asc": return arr.sort((a, b) => a.price - b.price);
    case "price-desc": return arr.sort((a, b) => b.price - a.price);
    case "name": return arr.sort((a, b) => a.name.localeCompare(b.name));
    case "newest": return arr.sort((a, b) => (a._id < b._id ? 1 : a._id > b._id ? -1 : 0));
    case "featured":
    default:
      return arr.sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
        if (a.isBestSeller !== b.isBestSeller) return a.isBestSeller ? -1 : 1;
        return a._id < b._id ? 1 : a._id > b._id ? -1 : 0;
      });
  }
}
