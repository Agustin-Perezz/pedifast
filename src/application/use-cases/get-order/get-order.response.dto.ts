import type { Order } from "@/domain/entities/order.entity";

export type GetOrderResponseDto = {
  readonly order: Order | null;
};
