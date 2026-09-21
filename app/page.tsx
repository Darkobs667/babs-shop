import Image from "next/image";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, productImages, products } from "@/lib/db/schema";

export const revalidate = 300;
export default async function HomePage() {
  const [featured, categoryList] = await Promise.all([
    db.select({ id: products.id, name: products.name, slug: products.slug, price: products.price, imageUrl: productImages.url }).from(products).leftJoin(productImages, eq(productImages.productId, products.id)).where(eq(products.featured, 1)).orderBy(desc(products.createdAt)).limit(8),
    db.select().from(categories).limit(8),
  ]);
  return <main><section className="bg-zinc-950 px-6 py-24 text-center text-white"><p className="mb-3 text-sm uppercase tracking-[.3em] text-zinc-400">Babs Shop</p><h1 className="text-4xl font-bold sm:text-6xl">Les pièces que vous allez aimer.</h1><Link href="/catalogue" className="mt-8 inline-block rounded bg-white px-5 py-3 font-medium text-black">Voir le catalogue</Link></section><section className="mx-auto max-w-6xl p-6"><h2 className="text-2xl font-bold">Catégories</h2><div className="mt-4 flex flex-wrap gap-3">{categoryList.map((category) => <Link key={category.id} href={`/catalogue?category=${category.slug}`} className="rounded-full border px-4 py-2">{category.name}</Link>)}</div><h2 className="mt-12 text-2xl font-bold">À la une</h2><div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">{featured.map((product) => <Link key={product.id} href={`/produits/${product.slug}`} className="group"><div className="relative aspect-square overflow-hidden rounded bg-zinc-100">{product.imageUrl && <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width:640px) 50vw,25vw" className="object-cover transition group-hover:scale-105" />}</div><p className="mt-2 font-medium">{product.name}</p><p>₦{Number(product.price).toLocaleString("en-NG")}</p></Link>)}</div></section></main>;
}
