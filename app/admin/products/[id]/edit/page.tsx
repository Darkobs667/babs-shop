import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { ProductForm } from "@/components/admin/product-form";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
export const dynamic = "force-dynamic";
export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const [product, categoryList] = await Promise.all([db.query.products.findFirst({ where: eq(products.id, id), with: { images: { orderBy: (images, { asc }) => [asc(images.position)] }, variants: true } }), db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.name))]); if (!product) notFound(); return <ProductForm product={product} categories={categoryList} />; }
