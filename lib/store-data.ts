import { and, asc, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";

/**
 * Donnees publiques : partagees par tous les visiteurs et stockees dans le
 * Data Cache Vercel. Elles sont invalidees des qu'un admin modifie le catalogue.
 */
export const getStoreHome = unstable_cache(
  async () => Promise.all([
    db.query.products.findMany({
      where: and(eq(products.featured, 1), eq(products.published, 1)),
      with: { images: { orderBy: (images, { asc }) => [asc(images.position)] } },
      orderBy: (product, { desc }) => [desc(product.createdAt)],
      limit: 8,
    }),
    db.select().from(categories).orderBy(asc(categories.name)).limit(8),
  ]),
  ["store-home-v1"],
  { tags: ["store-catalog"], revalidate: 3600 },
);

export const getStoreCatalog = unstable_cache(
  async () => Promise.all([
    db.query.products.findMany({
      where: eq(products.published, 1),
      with: { images: { orderBy: (images, { asc }) => [asc(images.position)] } },
      orderBy: (product, { asc }) => [asc(product.name)],
    }),
    db.select({ id: categories.id, name: categories.name, slug: categories.slug }).from(categories).orderBy(asc(categories.name)),
  ]),
  ["store-catalog-v1"],
  { tags: ["store-catalog"], revalidate: 3600 },
);

export function getStoreProduct(slug: string) {
  return unstable_cache(
    () => db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: {
        images: { orderBy: (images, { asc }) => [asc(images.position)] },
        variants: true,
      },
    }),
    ["store-product-v1", slug],
    { tags: ["store-catalog", `store-product-${slug}`], revalidate: 3600 },
  )();
}
