import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, categoryList] = await Promise.all([
    db.query.products.findMany({
      where: eq(products.featured, 1),
      with: { images: { orderBy: (images, { asc }) => [asc(images.position)] } },
      orderBy: (products, { desc }) => [desc(products.createdAt)],
      limit: 8,
    }),
    db.select().from(categories).limit(8),
  ]);

  return <main><section className="bg-zinc-950 px-6 py-24 text-center text-white"><p className="mb-3 text-sm uppercase tracking-[.3em] text-zinc-400">Babs Shop</p><h1 className="text-4xl font-bold sm:text-6xl">Les pieces que vous allez aimer.</h1><Link href="/catalogue" className="mt-8 inline-block rounded bg-white px-5 py-3 font-medium text-black">Voir le catalogue</Link></section><section className="mx-auto max-w-6xl p-6"><h2 className="text-2xl font-bold">Categories</h2><div className="mt-4 flex flex-wrap gap-3">{categoryList.map((category) => <Link key={category.id} href={`/catalogue?category=${category.slug}`} className="rounded-full border px-4 py-2">{category.name}</Link>)}</div><h2 className="mt-12 text-2xl font-bold">A la une</h2><div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">{featured.map((product) => <Link key={product.id} href={`/produits/${product.slug}`} className="group"><div className="aspect-square overflow-hidden rounded bg-zinc-100">{product.images[0] && <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover transition group-hover:scale-105" />}</div><p className="mt-2 font-medium">{product.name}</p><p>FCFA {Number(product.price).toLocaleString("fr-FR")}</p></Link>)}</div></section></main>;
}
