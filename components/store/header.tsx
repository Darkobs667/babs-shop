"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";

export function StoreHeader() {
  const [open, setOpen] = useState(false);
  const count = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));
  const links = [{ href: "/", label: "Accueil" }, { href: "/catalogue", label: "Catalogue" }];
  return <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur"><nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"><Link href="/" className="text-lg font-bold tracking-tight">Babs Shop</Link><div className="hidden items-center gap-6 sm:flex">{links.map((link) => <Link key={link.href} href={link.href} className="text-sm font-medium text-zinc-700 hover:text-black">{link.label}</Link>)}</div><div className="flex items-center gap-2"><Link href="/panier" aria-label="Voir le panier" className="relative rounded-md p-2 hover:bg-zinc-100"><ShoppingBag size={20} />{count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-black px-1 text-xs font-bold text-white">{count}</span>}</Link><button onClick={() => setOpen(!open)} className="rounded-md p-2 hover:bg-zinc-100 sm:hidden" aria-label="Ouvrir le menu">{open ? <X size={20} /> : <Menu size={20} />}</button></div></nav>{open && <div className="border-t bg-white px-4 py-3 sm:hidden">{links.map((link) => <Link onClick={() => setOpen(false)} key={link.href} href={link.href} className="block rounded-md px-3 py-2 font-medium hover:bg-zinc-100">{link.label}</Link>)}</div>}</header>;
}
