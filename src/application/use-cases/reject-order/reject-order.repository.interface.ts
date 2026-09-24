import type { ListOrdersByShopRepository } from "../list-orders-by-shop/list-orders-by-shop.repository.interface";
import type { UpdateOrderStatusRepository } from "../update-order-status/update-order-status.repository.interface";

export type RejectOrderRepository = ListOrdersByShopRepository &
  Pick<UpdateOrderStatusRepository, "updateStatus">;
