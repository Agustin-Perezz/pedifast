import { OrderMapper } from '$domain/mappers/order.mapper';
import type { CreateOrderDto, Order } from '$domain/models/order';

import { OrderStatus, type OrderStatusValue } from '$lib/schemas/order';
import type { OrdersRepository } from '$lib/server/repositories/orders.repository';
import type { ShopsRepository } from '$lib/server/repositories/shops.repository';

export class OrdersService {
  constructor(
    private readonly ordersRepo: OrdersRepository,
    private readonly shopsRepo: ShopsRepository
  ) {}

  async createOrder(shopName: string, input: CreateOrderDto): Promise<Order> {
    const shop = await this.shopsRepo.getShopId(shopName);
    if (!shop) {
      throw new Error(`Shop not found: ${shopName}`);
    }

    const insert = OrderMapper.fromDtoToInsertEntity(shop.id, input);
    return this.ordersRepo.insert(insert);
  }

  async getShopOrders(
    shopId: number,
    status?: OrderStatusValue
  ): Promise<Order[]> {
    return this.ordersRepo.getByShopId(shopId, status);
  }

  async getByExternalReference(
    externalReference: string
  ): Promise<Order | null> {
    return this.ordersRepo.getByExternalReference(externalReference);
  }

  async confirmOrder(orderId: number, shopId: number): Promise<Order> {
    const orders = await this.ordersRepo.getByShopId(shopId);
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      throw new Error('Order not found or does not belong to this shop');
    }

    return this.ordersRepo.updateStatus(orderId, OrderStatus.enum.confirmed);
  }

  async rejectOrder(orderId: number, shopId: number): Promise<Order> {
    const orders = await this.ordersRepo.getByShopId(shopId);
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      throw new Error('Order not found or does not belong to this shop');
    }

    return this.ordersRepo.updateStatus(orderId, OrderStatus.enum.rejected);
  }

  async updatePaymentStatus(
    externalReference: string,
    paymentStatus: string
  ): Promise<Order | null> {
    return this.ordersRepo.updatePaymentStatus(
      externalReference,
      paymentStatus
    );
  }
}
