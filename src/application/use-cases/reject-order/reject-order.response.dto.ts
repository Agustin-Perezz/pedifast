import type { Order } from "@/domain/entities/order.entity";

export type RejectOrderResponseDto = {
  readonly order: Order;
};
