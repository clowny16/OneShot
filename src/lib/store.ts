"use client";
// Client-side store: view routing (SPA-style on single / route), product slug,
// cart snapshot, and async actions that call the API.
import { create } from "zustand";
import type { CartDTO, ProductDTO, ViewName } from "@/lib/types";

type NavTarget =
  | { view: "home" }
  | { view: "collection"; category?: string }
  | { view: "product"; slug: string }
  | { view: "cart" }
  | { view: "checkout" }
  | { view: "about" }
  | { view: "contact" }
  | { view: "faq" }
  | { view: "shipping" }
  | { view: "returns" };

type State = {
  view: ViewName;
  productSlug: string | null;
  collectionCategory: string | null;
  cart: CartDTO | null;
  cartLoading: boolean;
  products: ProductDTO[];
  lastOrder: {
    orderId: string;
    total: number;
    shipping: number;
    subtotal: number;
    email: string;
    name: string;
  } | null;

  initProducts: (products: ProductDTO[]) => void;
  navigate: (target: NavTarget) => void;
  loadCart: () => Promise<void>;
  addToCart: (
    product: ProductDTO,
    colorHex: string,
    quantity?: number,
  ) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  placeOrder: (payload: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  resetOrder: () => void;
};

export const useStore = create<State>((set, get) => ({
  view: "home",
  productSlug: null,
  collectionCategory: null,
  cart: null,
  cartLoading: false,
  products: [],
  lastOrder: null,

  initProducts: (products) => set({ products }),

  navigate: (target) => {
    if (target.view === "collection") {
      set({
        view: "collection",
        collectionCategory: target.category ?? null,
      });
    } else if (target.view === "product") {
      set({ view: "product", productSlug: target.slug });
    } else {
      set({ view: target.view });
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  },

  loadCart: async () => {
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      const data = (await res.json()) as CartDTO;
      set({ cart: data });
    } catch {
      // ignore network blips
    }
  },

  addToCart: async (product, colorHex, quantity = 1) => {
    set({ cartLoading: true });
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          productId: product.id,
          colorHex,
          quantity,
        }),
      });
      const data = (await res.json()) as CartDTO;
      set({ cart: data });
    } finally {
      set({ cartLoading: false });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    set({ cartLoading: true });
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", itemId, quantity }),
      });
      const data = (await res.json()) as CartDTO;
      set({ cart: data });
    } finally {
      set({ cartLoading: false });
    }
  },

  removeItem: async (itemId) => {
    set({ cartLoading: true });
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove", itemId }),
      });
      const data = (await res.json()) as CartDTO;
      set({ cart: data });
    } finally {
      set({ cartLoading: false });
    }
  },

  clearCart: async () => {
    set({ cartLoading: true });
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      });
      const data = (await res.json()) as CartDTO;
      set({ cart: data });
    } finally {
      set({ cartLoading: false });
    }
  },

  placeOrder: async (payload) => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error ?? "Checkout failed." };
      }
      set({
        lastOrder: {
          orderId: data.orderId,
          total: data.total,
          shipping: data.shipping,
          subtotal: data.subtotal,
          email: data.email,
          name: data.name,
        },
        cart: null,
        view: "checkout",
      });
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  },

  resetOrder: () => set({ lastOrder: null }),
}));
