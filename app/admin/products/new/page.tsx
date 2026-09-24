import { asc } from "drizzle-orm";
import { ProductForm } from "@/components/admin/product-form";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
export const dynamic = "force-dynamic";
export default async function NewProductPage() { const categoryList = await db.select({ id: categories.id, name: categories.name }).from(categories).orderBy(asc(categories.name)); return <ProductForm categories={categoryList} />; }
