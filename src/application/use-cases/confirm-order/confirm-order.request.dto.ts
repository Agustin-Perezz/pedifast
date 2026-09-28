import { z } from "zod";

export const confirmOrderRequestDto = z.object({
  orderId: z.number().int().positive(),
  shopId: z.number().int().positive(),
});

export type ConfirmOrderRequestDto = z.infer<typeof confirmOrderRequestDto>;
