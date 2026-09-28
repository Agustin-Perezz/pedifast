import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import { Order } from "@/domain/entities/order.entity";
import type { OrderItemSchema } from "@/domain/entities/order-item.schema";
import { OrderStatus } from "@/domain/entities/order-status.enum";
import { PaymentMethod } from "@/domain/entities/payment-method.enum";
import { PaymentStatus } from "@/domain/entities/payment-status.enum";

export type MakeOrderInput = {
  readonly id?: number;
  readonly shopId?: number;
  readonly externalReference?: string;
  readonly customerName?: string;
  readonly customerPhone?: string | null;
  readonly notes?: string | null;
  readonly deliveryMethod?: DeliveryMethod;
  readonly address?: string | null;
  readonly paymentMethod?: PaymentMethod;
  readonly paymentStatus?: PaymentStatus;
  readonly items?: ReadonlyArray<OrderItemSchema>;
  readonly total?: number;
  readonly deliveryCost?: number;
  readonly status?: OrderStatus;
  readonly createdAt?: string;
  readonly updatedAt?: string;
};

export function makeOrder(input: MakeOrderInput = {}): Order {
  return Order.create({
    id: input.id ?? 1,
    shopId: input.shopId ?? 2,
    externalReference: input.externalReference ?? "pizzeria-luca-1700000000000",
    customerName: input.customerName ?? "Agustin",
    customerPhone: input.customerPhone ?? null,
    notes: input.notes ?? null,
    deliveryMethod: input.deliveryMethod ?? DeliveryMethod.Delivery,
    address: input.address ?? null,
    paymentMethod: input.paymentMethod ?? PaymentMethod.Efectivo,
    paymentStatus: input.paymentStatus ?? PaymentStatus.Approved,
    items: [
      ...(input.items ?? [
        { name: "Pizza", quantity: 1, unitPrice: 1500, accessories: [] },
      ]),
    ],
    total: input.total ?? 1500,
    deliveryCost: input.deliveryCost ?? 0,
    status: input.status ?? OrderStatus.Pending,
    createdAt: input.createdAt ?? "2026-01-01T00:00:00.000Z",
    updatedAt: input.updatedAt ?? "2026-01-01T00:00:00.000Z",
  });
}
