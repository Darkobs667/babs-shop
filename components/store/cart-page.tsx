"use client";

import Link from "next/link";
import { LoaderCircle, Minus, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { beginWhatsAppOrder } from "@/app/actions/order";
import { useCartStore } from "@/stores/cart-store";

export function CartPage() {
  const { items, remove, setQuantity, clear } = useCartStore();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const submit = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      try {
        const url = await beginWhatsAppOrder({ customerName: String(formData.get("customerName") || "").trim(), customerAddress: String(formData.get("customerAddress") || "").trim(), customerPhone: String(formData.get("customerPhone") || "").trim(), items });
        clear();
        window.location.assign(url);
      } catch (cause) { setError(cause instanceof Error ? cause.message : "La commande n'a pas pu etre preparee."); }
    });
  };
  if (!items.length) return <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6"><h1 className="text-3xl font-bold">Votre panier est vide</h1><p className="mt-3 text-zinc-600">Decouvrez les articles disponibles dans notre catalogue.</p><Link href="/catalogue" className="mt-6 inline-flex rounded-lg bg-black px-5 py-3 font-medium text-white">Voir le catalogue</Link></main>;
  return <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6"><h1 className="text-3xl font-bold">Votre panier</h1><div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"><section className="divide-y rounded-xl border">{items.map((item) => <article key={item.key} className="flex gap-3 p-3 sm:gap-4 sm:p-4"><div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-zinc-100">{item.imageUrl && <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover"/>}</div><div className="min-w-0 flex-1"><div className="flex gap-2"><div className="min-w-0 flex-1"><h2 className="truncate font-semibold">{item.productName}</h2>{item.variantName && <p className="text-sm text-zinc-500">{item.variantName}</p>}</div><button aria-label="Retirer du panier" onClick={() => remove(item.key)} className="p-1 text-zinc-500 hover:text-red-700"><Trash2 size={18}/></button></div><div className="mt-3 flex items-center justify-between"><div className="flex items-center rounded-md border"><button onClick={() => setQuantity(item.key, item.quantity - 1)} className="p-2" aria-label="Reduire la quantite"><Minus size={15}/></button><span className="min-w-8 text-center text-sm">{item.quantity}</span><button onClick={() => setQuantity(item.key, item.quantity + 1)} className="p-2" aria-label="Augmenter la quantite"><Plus size={15}/></button></div><p className="font-semibold">FCFA {(item.unitPrice * item.quantity).toLocaleString("fr-FR")}</p></div></div></article>)}</section><aside className="h-fit rounded-xl border p-5 lg:sticky lg:top-20"><h2 className="text-xl font-bold">Finaliser la commande</h2><p className="mt-2 text-sm text-zinc-600">Ces informations permettent a Babs Shop de confirmer la commande, le paiement et la livraison sur WhatsApp.</p><form action={submit} className="mt-5 space-y-3"><label className="block text-sm font-medium">Nom complet<input required minLength={2} name="customerName" placeholder="Votre nom complet" className="mt-1 w-full rounded-lg border px-3 py-2.5"/></label><label className="block text-sm font-medium">Telephone WhatsApp<input required name="customerPhone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Ex. 77 123 45 67" className="mt-1 w-full rounded-lg border px-3 py-2.5"/></label><label className="block text-sm font-medium">Adresse de livraison<textarea required minLength={5} name="customerAddress" placeholder="Quartier, rue et indication utile" rows={3} className="mt-1 w-full rounded-lg border px-3 py-2.5"/></label>{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="flex items-center justify-between border-t pt-4"><span className="font-medium">Total</span><strong className="text-xl">FCFA {total.toLocaleString("fr-FR")}</strong></div><button disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white disabled:opacity-60">{pending && <LoaderCircle className="animate-spin" size={18}/>} {pending ? "Preparation..." : "Commander via WhatsApp"}</button></form></aside></div></main>;
}
