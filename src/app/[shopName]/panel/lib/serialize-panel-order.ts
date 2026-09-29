import type { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import type { Order } from "@/domain/entities/order.entity";
import type { OrderStatus } from "@/domain/entities/order-status.enum";

export type PlainPanelItem = {
  readonly name: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly accessories: readonly { readonly name: string }[];
};

export type PlainPanelOrder = {
  readonly id: number;
  readonly externalReference: string;
  readonly customerName: string;
  readonly customerPhone: string | null;
  readonly notes: string | null;
  readonly deliveryMethod: `${DeliveryMethod}`;
  readonly address: string | null;
  readonly items: readonly PlainPanelItem[];
  readonly total: number;
  readonly deliveryCost: number;
  readonly status: `${OrderStatus}`;
  readonly createdAt: string;
};

export function serializePanelOrder(order: Order): PlainPanelOrder {
  return {
    id: order.id,
    externalReference: order.externalReference,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    notes: order.notes,
    deliveryMethod: order.deliveryMethod,
    address: order.address,
    items: order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      accessories: item.accessories.map((a) => ({ name: a.name })),
    })),
    total: order.total,
    deliveryCost: order.deliveryCost,
    status: order.status,
    createdAt: order.createdAt,
  };
}
