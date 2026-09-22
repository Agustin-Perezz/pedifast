import type { Order } from "@/domain/entities/order.entity";

export type UpdateOrderPaymentStatusResponseDto = {
  readonly order: Order | null;
};
