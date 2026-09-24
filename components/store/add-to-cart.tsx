"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";

type Variant = { id: string; name: string; price: string | null; stock: number };
export function AddToCart({ product }: { product: { id: string; name: string; price: string; stock: number; imageUrl?: string; variants: Variant[] } }) {
  const add = useCartStore((state) => state.add);
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [added, setAdded] = useState(false);
  const variant = product.variants.find((item) => item.id === variantId);
  const unitPrice = variant?.price === null || variant?.price === undefined ? Number(product.price) : Number(variant.price);
  const available = product.variants.length === 0 ? product.stock > 0 : Boolean(variant && variant.stock > 0);
  const handleAdd = () => { if (!available) return; add({ key: `${product.id}:${variant?.id ?? "default"}`, productId: product.id, productName: product.name, variantName: variant?.name, unitPrice, imageUrl: product.imageUrl }); setAdded(true); window.setTimeout(() => setAdded(false), 1800); };
  return <div className="space-y-5">{product.variants.length > 0 && <fieldset><legend className="mb-2 text-sm font-medium">Choisir une variante</legend><div className="flex flex-wrap gap-2">{product.variants.map((item) => <button key={item.id} type="button" disabled={item.stock === 0} onClick={() => setVariantId(item.id)} className={`rounded-lg border px-3 py-2 text-sm font-medium ${item.id === variantId ? "border-black bg-black text-white" : "bg-white"} disabled:cursor-not-allowed disabled:opacity-40`}>{item.name}</button>)}</div></fieldset>}<p className={`text-sm font-medium ${available ? "text-emerald-700" : "text-red-700"}`}>{available ? "En stock" : "Rupture de stock"}</p><button onClick={handleAdd} disabled={!available} className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{added ? <><Check size={19} />Ajouté au panier</> : <><ShoppingBag size={19} />Ajouter au panier · ₣{unitPrice.toLocaleString("fr-FR")}</>}</button></div>;
}
