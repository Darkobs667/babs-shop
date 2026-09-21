"use server";
import { db } from "@/lib/db";
import { orderItems, orders } from "@/lib/db/schema";
import { whatsappOrderInput } from "@/lib/validations";
import { createWhatsAppOrderUrl } from "@/lib/whatsapp";

export async function beginWhatsAppOrder(input: unknown) {
  const data = whatsappOrderInput.parse(input);
  const total = data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  // L'enregistrement est volontairement avant la redirection et n'effectue aucun paiement.
  await db.transaction(async (tx) => {
    const [order] = await tx.insert(orders).values({ customerName: data.customerName, customerAddress: data.customerAddress, customerPhone: data.customerPhone, total: String(total) }).returning();
    await tx.insert(orderItems).values(data.items.map((item) => ({ orderId: order.id, productName: item.productName, variantName: item.variantName, unitPrice: String(item.unitPrice), quantity: item.quantity })));
  });
  return createWhatsAppOrderUrl(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!, data);
}
