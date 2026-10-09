import type { Order } from "@/domain/entities/order.entity";
import type { OrderStatus } from "@/domain/entities/order-status.enum";

export interface ConfirmOrderRepository {
  updateStatusForShop(
    orderId: number,
    shopId: number,
    status: OrderStatus,
  ): Promise<Order | null>;
}
