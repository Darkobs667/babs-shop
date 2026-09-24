import { z } from "zod";

export const productInput = z.object({
  id: z.string().uuid().optional(), name: z.string().min(2).max(140), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(5000).default(""), price: z.coerce.number().nonnegative(), categoryId: z.string().uuid().nullable().optional(), categoryName: z.string().trim().min(2).max(80).optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  stock: z.number().int().nonnegative().max(999999).default(0),
  imageUrls: z.array(z.string().url()).max(8).default([]),
  variants: z.array(z.object({ name: z.string().trim().min(1).max(100), sku: z.string().trim().max(80).optional(), price: z.number().nonnegative().nullable(), stock: z.number().int().nonnegative().max(999999) })).max(30).default([]),
});
export const whatsappOrderInput = z.object({
  customerName: z.string().min(2).max(100).optional(), customerAddress: z.string().max(300).optional(),
  customerPhone: z.string().max(30).optional(),
  items: z.array(z.object({ productId: z.string().uuid(), productName: z.string().min(1), variantName: z.string().optional(), unitPrice: z.number().nonnegative(), quantity: z.number().int().positive().max(99) })).min(1),
});
