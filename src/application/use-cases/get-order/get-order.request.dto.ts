import { z } from "zod";

export const getOrderRequestDto = z.object({
  externalReference: z.string().min(1),
});

export type GetOrderRequestDto = z.infer<typeof getOrderRequestDto>;
