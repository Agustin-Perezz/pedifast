import { z } from "zod";

const preferenceItemDto = z.object({
  title: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  currencyId: z.literal("ARS"),
});

export const createMpPreferenceRequestDto = z.object({
  shopName: z.string().min(1),
  nombre: z.string().min(1),
  notas: z.string().default(""),
  deliveryMethod: z.enum(["pickup", "delivery"]),
  address: z.string().default(""),
  items: z.array(preferenceItemDto).min(1),
  baseUrl: z.string().min(1),
});

export type CreateMpPreferenceRequestDto = z.infer<
  typeof createMpPreferenceRequestDto
>;
