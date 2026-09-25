import Link from "next/link";
import { and, asc, eq, gte, ilike, lte, or } from "drizzle-orm";
import { CatalogFilters } from "@/components/store/catalog-filters";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function CataloguePage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; min?: string; max?: string }> }) {
  const query = await searchParams;
  const conditions = [eq(products.published, 1)];
  if (query.q) conditions.push(or(ilike(products.name, `%${query.q}%`), ilike(products.description, `%${query.q}%`))!);
  if (query.category) { const [category] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, query.category)).limit(1); if (category) conditions.push(eq(products.categoryId, category.id)); }
  if (query.min) conditions.push(gte(products.price, String(Number(query.min))));
  if (query.max) conditions.push(lte(products.price, String(Number(query.max))));
  const [items, categoryList] = await Promise.all([db.query.products.findMany({ where: and(...conditions), with: { images: { orderBy: (images, { asc }) => [asc(images.position)] } }, orderBy: (products, { asc }) => [asc(products.name)] }), db.select({ name: categories.name, slug: categories.slug }).from(categories).orderBy(asc(categories.name))]);
  return <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6"><div className="mb-7"><p className="text-sm font-medium text-zinc-500">Babs Shop</p><h1 className="text-3xl font-bold sm:text-4xl">Catalogue</h1></div><CatalogFilters categories={categoryList}/><p className="mb-4 text-sm text-zinc-500">{items.length} produit{items.length !== 1 ? "s" : ""} trouve{items.length !== 1 ? "s" : ""}</p>{items.length ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{items.map(product => <Link key={product.id} href={`/produits/${product.slug}`} className="group"><div className="aspect-square overflow-hidden rounded-lg bg-zinc-100">{product.images[0] && <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />}</div><h2 className="mt-2 truncate font-medium">{product.name}</h2><p className="text-sm">FCFA {Number(product.price).toLocaleString("fr-FR")}</p></Link>)}</div> : <div className="rounded-xl border border-dashed p-10 text-center text-zinc-500">Aucun produit ne correspond a ces criteres.</div>}</main>;
}
