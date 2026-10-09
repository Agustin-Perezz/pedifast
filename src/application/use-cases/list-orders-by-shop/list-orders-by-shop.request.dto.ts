import { z } from "zod";
import { OrderStatus } from "@/domain/entities/order-status.enum";

export const listOrdersByShopRequestDto = z.object({
  shopId: z.number().int().positive(),
  status: z.enum(OrderStatus).optional(),
});

export type ListOrdersByShopRequestDto = z.infer<
  typeof listOrdersByShopRequestDto
>;
