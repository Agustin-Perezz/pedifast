import type { Order } from "@/domain/entities/order.entity";

export type CreateOrderResponseDto = {
  readonly order: Order;
};
