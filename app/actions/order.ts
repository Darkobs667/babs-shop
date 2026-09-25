"use server";

import { headers } from "next/headers";
import { inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { orderItems, orders, products } from "@/lib/db/schema";
import { rateLimit, requestIp } from "@/lib/rate-limit";
import { whatsappOrderInput } from "@/lib/validations";
import { createWhatsAppOrderUrl } from "@/lib/whatsapp";

export async function beginWhatsAppOrder(input: unknown) {
  const data = whatsappOrderInput.parse(input);
  const requestHeaders = await headers();
  const throttle = rateLimit(`order:${requestIp(requestHeaders)}`, 8, 10 * 60 * 1000);
  if (throttle.limited) throw new Error(`Trop de tentatives. Reessayez dans ${throttle.retryAfter} secondes.`);

  const grouped = new Map<string, { productId: string; variantId?: string; quantity: number }>();
  for (const item of data.items) {
    const key = `${item.productId}:${item.variantId ?? "default"}`;
    const previous = grouped.get(key);
    grouped.set(key, { ...item, quantity: (previous?.quantity ?? 0) + item.quantity });
  }

  const requested = [...grouped.values()];
  const catalog = await db.query.products.findMany({
    where: inArray(products.id, [...new Set(requested.map((item) => item.productId))]),
    with: { variants: true },
  });
  const byId = new Map(catalog.map((product) => [product.id, product]));
  const items = requested.map((item) => {
    const product = byId.get(item.productId);
    if (!product || !product.published) throw new Error("Un article du panier n'est plus disponible.");
    const variant = item.variantId ? product.variants.find((candidate) => candidate.id === item.variantId) : undefined;
    if (item.variantId && !variant) throw new Error(`La variante de ${product.name} n'est plus disponible.`);
    if (!item.variantId && product.variants.length) throw new Error(`Selectionnez une variante pour ${product.name}.`);
    const stock = variant ? variant.stock : product.stock;
    if (stock < item.quantity) throw new Error(`Stock insuffisant pour ${product.name}.`);
    return {
      productName: product.name,
      variantName: variant?.name,
      unitPrice: Number(variant?.price ?? product.price),
      quantity: item.quantity,
    };
  });

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  await db.transaction(async (tx) => {
    const [order] = await tx.insert(orders).values({ customerName: data.customerName, customerAddress: data.customerAddress, customerPhone: data.customerPhone, total: String(total) }).returning();
    await tx.insert(orderItems).values(items.map((item) => ({ orderId: order.id, productName: item.productName, variantName: item.variantName, unitPrice: String(item.unitPrice), quantity: item.quantity })));
  });
  return createWhatsAppOrderUrl(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!, { ...data, items });
}
