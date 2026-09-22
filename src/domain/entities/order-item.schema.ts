import { z } from "zod";

export const orderItemAccessorySchema = z.object({
  name: z.string().min(1),
  priceDelta: z.number().default(0),
});

export const orderItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
  accessories: z.array(orderItemAccessorySchema).default(() => []),
});

export type OrderItemAccessorySchema = z.infer<typeof orderItemAccessorySchema>;
export type OrderItemSchema = z.infer<typeof orderItemSchema>;
