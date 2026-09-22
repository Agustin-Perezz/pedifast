import { z } from "zod";
import { OrderStatus } from "@/domain/entities/order-status.enum";

export const updateOrderStatusRequestDto = z.object({
  orderId: z.number().int().positive(),
  status: z.nativeEnum(OrderStatus),
});

export type UpdateOrderStatusRequestDto = z.infer<
  typeof updateOrderStatusRequestDto
>;
