import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { AddToCart } from "@/components/store/add-to-cart";
import { ProductGallery } from "@/components/store/product-gallery";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
export const dynamic = "force-dynamic";
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const product = await db.query.products.findFirst({ where: eq(products.slug, slug), with: { images: { orderBy: (images, { asc }) => [asc(images.position)] }, variants: true } }); if (!product || !product.published) notFound(); return <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:py-10"><div className="grid gap-8 lg:grid-cols-2 lg:gap-14"><ProductGallery images={product.images} name={product.name}/><div className="lg:pt-4"><p className="text-sm font-medium text-zinc-500">Babs Shop</p><h1 className="mt-1 text-3xl font-bold sm:text-4xl">{product.name}</h1><p className="mt-4 text-2xl font-semibold">₣{Number(product.price).toLocaleString("fr-FR")}</p><p className="mt-6 whitespace-pre-line leading-7 text-zinc-700">{product.description}</p><div className="mt-8 border-t pt-7"><AddToCart product={{ id: product.id, name: product.name, price: product.price, stock: product.stock, imageUrl: product.images[0]?.url, variants: product.variants }}/></div></div></div></main>; }
