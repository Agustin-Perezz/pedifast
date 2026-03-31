import type {
  CreateOrderDto,
  Order,
  OrderInsert,
  OrderItem
} from '$domain/models/order';

interface OrderEntity {
  id: number;
  shop_id: number;
  external_reference: string;
  customer_name: string;
  customer_phone: string | null;
  notes: string | null;
  delivery_method: string;
  address: string | null;
  payment_method: string;
  payment_status: string;
  items: unknown;
  total: number;
  delivery_cost: number;
  status: string;
  created_at: string;
}

export class OrderMapper {
  static fromEntityToOrder(entity: OrderEntity): Order {
    return {
      id: entity.id,
      shopId: entity.shop_id,
      externalReference: entity.external_reference,
      customerName: entity.customer_name,
      customerPhone: entity.customer_phone,
      notes: entity.notes,
      deliveryMethod: entity.delivery_method as Order['deliveryMethod'],
      address: entity.address,
      paymentMethod: entity.payment_method as Order['paymentMethod'],
      paymentStatus: entity.payment_status,
      items: entity.items as OrderItem[],
      total: Number(entity.total),
      deliveryCost: Number(entity.delivery_cost),
      status: entity.status as Order['status'],
      createdAt: entity.created_at
    } satisfies Order;
  }

  static fromEntitiesToOrders(entities: OrderEntity[]): Order[] {
    return entities.map(OrderMapper.fromEntityToOrder);
  }

  static fromDtoToInsertEntity(
    shopId: number,
    dto: CreateOrderDto
  ): OrderInsert {
    return {
      shop_id: shopId,
      external_reference: dto.externalReference,
      customer_name: dto.customerName,
      customer_phone: dto.customerPhone ?? null,
      notes: dto.notes ?? null,
      delivery_method: dto.deliveryMethod as OrderInsert['delivery_method'],
      address: dto.address ?? null,
      payment_method: dto.paymentMethod as OrderInsert['payment_method'],
      payment_status: dto.paymentStatus ?? 'pending',
      items: dto.items,
      total: dto.total,
      delivery_cost: dto.deliveryCost ?? 0
    } satisfies OrderInsert;
  }
}
