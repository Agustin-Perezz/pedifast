import { OrderStatus, type OrderStatusValue } from '$lib/schemas/order';
import type { OrdersRepository } from '$lib/server/repositories/orders.repository';
import type { ShopsRepository } from '$lib/server/repositories/shops.repository';
import type { Order, OrderInsert, OrderItem } from '$lib/types/order';

interface CreateOrderInput {
  externalReference: string;
  customerName: string;
  customerPhone?: string;
  notes?: string;
  deliveryMethod: string;
  address?: string;
  paymentMethod: string;
  paymentStatus?: string;
  items: OrderItem[];
  total: number;
  deliveryCost?: number;
}

function mapRowToOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as number,
    shopId: row.shop_id as number,
    externalReference: row.external_reference as string,
    customerName: row.customer_name as string,
    customerPhone: (row.customer_phone as string) ?? null,
    notes: (row.notes as string) ?? null,
    deliveryMethod: row.delivery_method as Order['deliveryMethod'],
    address: (row.address as string) ?? null,
    paymentMethod: row.payment_method as Order['paymentMethod'],
    paymentStatus: row.payment_status as string,
    items: row.items as OrderItem[],
    total: Number(row.total),
    deliveryCost: Number(row.delivery_cost),
    status: row.status as Order['status'],
    createdAt: row.created_at as string
  };
}

export class OrdersService {
  constructor(
    private readonly ordersRepo: OrdersRepository,
    private readonly shopsRepo: ShopsRepository
  ) {}

  async createOrder(shopName: string, input: CreateOrderInput): Promise<Order> {
    const shop = await this.shopsRepo.getShopId(shopName);
    if (!shop) {
      throw new Error(`Shop not found: ${shopName}`);
    }

    const insert: OrderInsert = {
      shop_id: shop.id,
      external_reference: input.externalReference,
      customer_name: input.customerName,
      customer_phone: input.customerPhone ?? null,
      notes: input.notes ?? null,
      delivery_method: input.deliveryMethod as OrderInsert['delivery_method'],
      address: input.address ?? null,
      payment_method: input.paymentMethod as OrderInsert['payment_method'],
      payment_status: input.paymentStatus ?? 'pending',
      items: input.items,
      total: input.total,
      delivery_cost: input.deliveryCost ?? 0
    };

    const row = await this.ordersRepo.insert(insert);
    return mapRowToOrder(row);
  }

  async getShopOrders(
    shopId: number,
    status?: OrderStatusValue
  ): Promise<Order[]> {
    const rows = await this.ordersRepo.getByShopId(shopId, status);
    return rows.map(mapRowToOrder);
  }

  async getByExternalReference(
    externalReference: string
  ): Promise<Order | null> {
    const row = await this.ordersRepo.getByExternalReference(externalReference);
    if (!row) {
      return null;
    }
    return mapRowToOrder(row);
  }

  async confirmOrder(orderId: number, shopId: number): Promise<Order> {
    const orders = await this.ordersRepo.getByShopId(shopId);
    const order = orders.find(
      (o) => (o as Record<string, unknown>).id === orderId
    );
    if (!order) {
      throw new Error('Order not found or does not belong to this shop');
    }

    const row = await this.ordersRepo.updateStatus(
      orderId,
      OrderStatus.enum.confirmed
    );
    return mapRowToOrder(row);
  }

  async rejectOrder(orderId: number, shopId: number): Promise<Order> {
    const orders = await this.ordersRepo.getByShopId(shopId);
    const order = orders.find(
      (o) => (o as Record<string, unknown>).id === orderId
    );
    if (!order) {
      throw new Error('Order not found or does not belong to this shop');
    }

    const row = await this.ordersRepo.updateStatus(
      orderId,
      OrderStatus.enum.rejected
    );
    return mapRowToOrder(row);
  }

  async updatePaymentStatus(
    externalReference: string,
    paymentStatus: string
  ): Promise<Order | null> {
    const row = await this.ordersRepo.updatePaymentStatus(
      externalReference,
      paymentStatus
    );
    if (!row) {
      return null;
    }
    return mapRowToOrder(row);
  }
}
