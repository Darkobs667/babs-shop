import Link from "next/link";
import { LayoutDashboard, PackagePlus, PackageSearch } from "lucide-react";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><header className="border-b bg-white"><nav className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-3 sm:px-6"><Link href="/admin" className="mr-3 whitespace-nowrap text-lg font-bold">Babs Shop</Link><Link href="/admin" className="inline-flex whitespace-nowrap items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-zinc-100"><LayoutDashboard size={17} />Tableau de bord</Link><Link href="/admin/products" className="inline-flex whitespace-nowrap items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-zinc-100"><PackageSearch size={17} />Produits</Link><Link href="/admin/products/new" className="inline-flex whitespace-nowrap items-center gap-2 rounded-md bg-zinc-950 px-3 py-2 text-sm font-medium text-white"><PackagePlus size={17} />Ajouter</Link></nav></header>{children}</>;
}
