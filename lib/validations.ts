import { z } from "zod";

export const productInput = z.object({
  id: z.string().uuid().optional(), name: z.string().min(2).max(140), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(5000).default(""), price: z.coerce.number().nonnegative(), categoryId: z.string().uuid().nullable().optional(),
  imageUrls: z.array(z.string().url()).max(8).default([]),
});
export const whatsappOrderInput = z.object({
  customerName: z.string().min(2).max(100).optional(), customerAddress: z.string().max(300).optional(),
  customerPhone: z.string().max(30).optional(),
  items: z.array(z.object({ productId: z.string().uuid(), productName: z.string().min(1), variantName: z.string().optional(), unitPrice: z.number().nonnegative(), quantity: z.number().int().positive().max(99) })).min(1),
});
