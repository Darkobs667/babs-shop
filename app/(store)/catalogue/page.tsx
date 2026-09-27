import Link from "next/link";
import { CatalogFilters } from "@/components/store/catalog-filters";
import { getStoreCatalog } from "@/lib/store-data";

type Search = { q?: string; category?: string; min?: string; max?: string };

export default async function CataloguePage({ searchParams }: { searchParams: Promise<Search> }) {
  const query = await searchParams;
  const [catalog, categoryList] = await getStoreCatalog();
  const search = query.q?.trim().toLocaleLowerCase();
  const min = Number(query.min);
  const max = Number(query.max);
  const items = catalog.filter((product) => {
    if (search && !`${product.name} ${product.description}`.toLocaleLowerCase().includes(search)) return false;
    if (query.category) {
      const category = categoryList.find((item) => item.slug === query.category);
      if (!category || product.categoryId !== category.id) return false;
    }
    const price = Number(product.price);
    if (query.min && (!Number.isFinite(min) || price < min)) return false;
    if (query.max && (!Number.isFinite(max) || price > max)) return false;
    return true;
  });

  return <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6"><div className="mb-7"><p className="text-sm font-medium text-zinc-500">Babs Shop</p><h1 className="text-3xl font-bold sm:text-4xl">Catalogue</h1></div><CatalogFilters categories={categoryList}/><p className="mb-4 text-sm text-zinc-500">{items.length} produit{items.length !== 1 ? "s" : ""} trouve{items.length !== 1 ? "s" : ""}</p>{items.length ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{items.map(product => <Link key={product.id} href={`/produits/${product.slug}`} className="group"><div className="aspect-square overflow-hidden rounded-lg bg-zinc-100">{product.images[0] && <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />}</div><h2 className="mt-2 truncate font-medium">{product.name}</h2><p className="text-sm">FCFA {Number(product.price).toLocaleString("fr-FR")}</p></Link>)}</div> : <div className="rounded-xl border border-dashed p-10 text-center text-zinc-500">Aucun produit ne correspond a ces criteres.</div>}</main>;
}
