
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InventoryType } from "@/types/api";

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image?: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  stock: number;
  inventoryType: InventoryType;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, qty: number) => void;
  clear: () => void;
}

/**
 * Returns a "cap" on quantity based on inventory type.
 * - IN_STOCK: cap at stock
 * - MADE_TO_ORDER / PRE_ORDER: no cap (Infinity)
 */
function maxQtyFor(item: { stock: number; inventoryType: InventoryType }): number {
  return item.inventoryType === "IN_STOCK" ? Math.max(1, item.stock) : Infinity;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      add: (item, qty = 1) =>
        set((state) => {
          const cap = maxQtyFor(item);
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: Math.min(cap, i.quantity + qty) }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: Math.min(cap, qty) }],
          };
        }),

      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      setQuantity: (productId, qty) =>
        set((state) => ({
          items: state.items.map((i) => {
            if (i.productId !== productId) return i;
            const cap = maxQtyFor(i);
            return { ...i, quantity: Math.max(1, Math.min(cap, qty)) };
          }),
        })),

      clear: () => set({ items: [] }),
    }),
    {
      name: "reborn-cart",
      version: 1,
    }
  )
);

// ------------------------------------------------------------
// Standalone helpers (use with useCartStore((s) => s.items))
// ------------------------------------------------------------
export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
}