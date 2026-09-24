import Link from "next/link";
import { BarChart3, LayoutDashboard, LogOut, PackagePlus, PackageSearch, ShoppingBag } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { logout } from "./logout/actions";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Le login doit rester une page autonome : aucune navigation privée avant session valide.
  if (!(await isAdmin())) return children;
  return <><header className="border-b bg-white"><nav className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-3 sm:px-6"><Link href="/admin" className="mr-3 inline-flex items-center gap-2 whitespace-nowrap text-lg font-bold"><span className="grid h-8 w-8 place-items-center rounded-lg bg-zinc-950 text-white"><ShoppingBag size={17} /></span>Babs Shop</Link><Link href="/admin" className="inline-flex whitespace-nowrap items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-zinc-100"><LayoutDashboard size={17} />Tableau de bord</Link><Link href="/admin/products" className="inline-flex whitespace-nowrap items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-zinc-100"><PackageSearch size={17} />Produits</Link><Link href="/admin/analytics" className="inline-flex whitespace-nowrap items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-zinc-100"><BarChart3 size={17} />Analytics</Link><Link href="/admin/products/new" className="inline-flex whitespace-nowrap items-center gap-2 rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white"><PackagePlus size={17} />Ajouter</Link><form action={logout} className="ml-auto"><button className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"><LogOut size={17} />Déconnexion</button></form></nav></header>{children}</>;
}
