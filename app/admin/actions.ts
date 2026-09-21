"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { productImages, products } from "@/lib/db/schema";
import { productInput } from "@/lib/validations";

export async function saveProduct(input: unknown) {
  if (!(await isAdmin())) throw new Error("Non autorisé");
  const data = productInput.parse(input);
  const { id, imageUrls, ...productData } = data;
  const [product] = data.id
    ? await db.update(products).set({ ...productData, price: String(data.price), updatedAt: new Date() }).where(eq(products.id, data.id)).returning()
    : await db.insert(products).values({ ...productData, price: String(data.price) }).returning();
  if (!product) throw new Error("Produit introuvable");
  if (data.id) await db.delete(productImages).where(eq(productImages.productId, product.id));
  if (imageUrls.length) await db.insert(productImages).values(imageUrls.map((url, position) => ({ productId: product.id, url, position })));
  revalidatePath("/"); revalidatePath(`/produits/${product.slug}`); revalidatePath("/catalogue");
  return product;
}
