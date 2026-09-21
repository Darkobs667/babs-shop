export type WhatsAppItem = { productName: string; variantName?: string; unitPrice: number; quantity: number };
export type WhatsAppOrder = { items: WhatsAppItem[]; customerName?: string; customerAddress?: string; currency?: string };

export function createWhatsAppOrderUrl(phone: string, order: WhatsAppOrder) {
  const cleanPhone = phone.replace(/\D/g, "");
  if (!/^\d{8,15}$/.test(cleanPhone)) throw new Error("Numéro WhatsApp invalide");
  const currency = order.currency ?? "₦";
  const total = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const lines = ["Bonjour, je souhaite passer cette commande :", "", ...order.items.map((item) => `• ${item.productName}${item.variantName ? ` — ${item.variantName}` : ""} × ${item.quantity} = ${currency}${(item.unitPrice * item.quantity).toLocaleString("fr-FR")}`), "", `Total : ${currency}${total.toLocaleString("fr-FR")}`, "", `Nom : ${order.customerName || "à renseigner"}`, `Adresse de livraison : ${order.customerAddress || "à renseigner"}`];
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(lines.join("\n"))}`;
}
