import type { Order } from "@/domain/entities/order.entity";

export interface CreateOrderRepository {
  create(order: Order): Promise<Order>;
}
