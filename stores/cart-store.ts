"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export type CartItem = { key: string; productId: string; variantId?: string; productName: string; variantName?: string; unitPrice: number; quantity: number; imageUrl?: string };
type CartStore = { items: CartItem[]; add: (item: Omit<CartItem, "quantity">) => void; remove: (key: string) => void; setQuantity: (key: string, quantity: number) => void; clear: () => void; };
export const useCartStore = create<CartStore>()(persist((set) => ({ items: [], add: (item) => set(({ items }) => { const existing = items.find((x) => x.key === item.key); return { items: existing ? items.map((x) => x.key === item.key ? { ...x, quantity: x.quantity + 1 } : x) : [...items, { ...item, quantity: 1 }] }; }), remove: (key) => set(({ items }) => ({ items: items.filter((item) => item.key !== key) })), setQuantity: (key, quantity) => set(({ items }) => ({ items: quantity < 1 ? items.filter((item) => item.key !== key) : items.map((item) => item.key === key ? { ...item, quantity } : item) })), clear: () => set({ items: [] }) }), { name: "babs-cart-v1" }));
