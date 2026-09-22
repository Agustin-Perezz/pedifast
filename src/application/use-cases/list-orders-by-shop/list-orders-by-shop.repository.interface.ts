import type { Order } from "@/domain/entities/order.entity";
import type { OrderStatus } from "@/domain/entities/order-status.enum";

export interface ListOrdersByShopRepository {
  findByShopId(shopId: number, status?: OrderStatus): Promise<Order[]>;
}
