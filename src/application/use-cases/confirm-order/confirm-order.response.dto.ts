import type { Order } from "@/domain/entities/order.entity";

export type ConfirmOrderResponseDto = {
  readonly order: Order;
};
