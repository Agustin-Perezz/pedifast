import type { Order } from "@/domain/entities/order.entity";

export type ListOrdersByShopResponseDto = {
  readonly orders: Order[];
};
