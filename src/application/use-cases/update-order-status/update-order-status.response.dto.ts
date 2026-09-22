import type { Order } from "@/domain/entities/order.entity";

export type UpdateOrderStatusResponseDto = {
  readonly order: Order;
};
