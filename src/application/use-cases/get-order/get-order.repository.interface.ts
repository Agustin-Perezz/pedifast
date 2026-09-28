import type { Order } from "@/domain/entities/order.entity";

export interface GetOrderRepository {
  findByExternalReference(externalReference: string): Promise<Order | null>;
}
