"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function CatalogFilters({ categories }: { categories: { name: string; slug: string }[] }) {
  const router = useRouter(); const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [open, setOpen] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => { const next = new URLSearchParams(params.toString()); query ? next.set("q", query) : next.delete("q"); router.replace(`/catalogue?${next.toString()}`, { scroll: false }); }, 300); return () => window.clearTimeout(timer); }, [query, router, params]);
  const select = (key: string, value: string) => { const next = new URLSearchParams(params.toString()); value ? next.set(key, value) : next.delete(key); router.push(`/catalogue?${next.toString()}`); };
  return <div className="mb-7"><div className="flex gap-2"><label className="relative block flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un produit…" className="w-full rounded-lg border py-2.5 pl-10 pr-3" /></label><button onClick={() => setOpen(!open)} className="inline-flex items-center gap-2 rounded-lg border px-3 text-sm font-medium"><SlidersHorizontal size={18} /><span className="hidden sm:inline">Filtres</span></button></div><div className={`${open ? "mt-3 grid" : "hidden"} gap-3 rounded-lg border bg-zinc-50 p-3 sm:grid-cols-3`}><select value={params.get("category") ?? ""} onChange={(event) => select("category", event.target.value)} className="rounded-md border bg-white px-3 py-2"><option value="">Toutes les catégories</option>{categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select><input defaultValue={params.get("min") ?? ""} onBlur={(event) => select("min", event.target.value)} type="number" min="0" placeholder="Prix minimum (FCFA)" className="rounded-md border bg-white px-3 py-2" /><input defaultValue={params.get("max") ?? ""} onBlur={(event) => select("max", event.target.value)} type="number" min="0" placeholder="Prix maximum (FCFA)" className="rounded-md border bg-white px-3 py-2" /></div></div>;
}
