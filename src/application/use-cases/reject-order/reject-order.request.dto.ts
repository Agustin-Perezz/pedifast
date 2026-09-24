import { z } from "zod";

export const rejectOrderRequestDto = z.object({
  orderId: z.number().int().positive(),
  shopId: z.number().int().positive(),
});

export type RejectOrderRequestDto = z.infer<typeof rejectOrderRequestDto>;
