import type { Order } from "@/domain/entities/order.entity";
import type { OrderStatus } from "@/domain/entities/order-status.enum";

export interface UpdateOrderStatusRepository {
  updateStatus(orderId: number, status: OrderStatus): Promise<Order>;
}
