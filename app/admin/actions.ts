"use server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { categories, productImages, products, productVariants } from "@/lib/db/schema";
import { productInput } from "@/lib/validations";

export async function saveProduct(input: unknown) {
  if (!(await isAdmin())) throw new Error("Non autorisé");
  const data = productInput.parse(input);
  const { id, imageUrls, variants, categoryName, ...productData } = data;
  const product = await db.transaction(async (tx) => {
    let categoryId = productData.categoryId ?? null;
    if (categoryName) {
      const slug = categoryName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const existing = await tx.select().from(categories).where(eq(categories.slug, slug)).limit(1);
      categoryId = existing[0]?.id ?? (await tx.insert(categories).values({ name: categoryName, slug }).returning())[0]!.id;
    }
    const [saved] = id
      ? await tx.update(products).set({ ...productData, categoryId, published: data.published ? 1 : 0, featured: data.featured ? 1 : 0, stock: data.stock, price: String(data.price), updatedAt: new Date() }).where(eq(products.id, id)).returning()
      : await tx.insert(products).values({ ...productData, categoryId, published: data.published ? 1 : 0, featured: data.featured ? 1 : 0, stock: data.stock, price: String(data.price) }).returning();
    if (!saved) throw new Error("Produit introuvable");
    if (id) {
      await tx.delete(productImages).where(eq(productImages.productId, saved.id));
      await tx.delete(productVariants).where(eq(productVariants.productId, saved.id));
    }
    if (imageUrls.length) await tx.insert(productImages).values(imageUrls.map((url, position) => ({ productId: saved.id, url, position })));
    if (variants.length) await tx.insert(productVariants).values(variants.map((variant) => ({ productId: saved.id, name: variant.name, sku: variant.sku || null, price: variant.price === null ? null : String(variant.price), stock: variant.stock })));
    return saved;
  });
  revalidatePath("/"); revalidatePath(`/produits/${product.slug}`); revalidatePath("/catalogue");
  revalidatePath("/admin/products");
  return product;
}

export async function deleteProduct(id: string) {
  if (!(await isAdmin())) throw new Error("Non autorisé");
  const [product] = await db.delete(products).where(eq(products.id, id)).returning({ slug: products.slug });
  if (!product) throw new Error("Produit introuvable");
  revalidatePath("/"); revalidatePath("/catalogue"); revalidatePath("/admin/products"); revalidatePath(`/produits/${product.slug}`);
}
