import { z } from "zod";
import type { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import { Order } from "@/domain/entities/order.entity";
import {
  type OrderItemSchema,
  orderItemSchema,
} from "@/domain/entities/order-item.schema";
import type { OrderStatus } from "@/domain/entities/order-status.enum";
import type { PaymentMethod } from "@/domain/entities/payment-method.enum";
import type { PaymentStatus } from "@/domain/entities/payment-status.enum";
import type { OrderInsert, OrderRow } from "../entities/order.entity";

export const orderMapper = {
  toDomain(row: OrderRow): Order {
    return Order.create({
      id: row.id,
      shopId: row.shop_id,
      externalReference: row.external_reference,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      notes: row.notes,
      deliveryMethod: row.delivery_method as DeliveryMethod,
      address: row.address,
      paymentMethod: row.payment_method as PaymentMethod,
      paymentStatus: row.payment_status as PaymentStatus,
      items: mapItemsToDomain(row.items),
      total: Number(row.total),
      deliveryCost: Number(row.delivery_cost),
      status: row.status as OrderStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  },

  toPersistence(order: Order): OrderInsert {
    const props = order.toObject();
    return {
      shop_id: props.shopId,
      external_reference: props.externalReference,
      customer_name: props.customerName,
      customer_phone: props.customerPhone,
      notes: props.notes,
      delivery_method: props.deliveryMethod,
      address: props.address,
      payment_method: props.paymentMethod,
      payment_status: props.paymentStatus,
      items: mapItemsToPersistence(props.items),
      total: props.total,
      delivery_cost: props.deliveryCost,
      status: props.status,
      created_at: props.createdAt,
      updated_at: props.updatedAt,
    };
  },
};

function mapItemsToDomain(items: unknown): OrderItemSchema[] {
  const parsed = z.array(orderItemSchema).safeParse(
    (items as Array<Record<string, unknown>> | undefined)?.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      accessories: (
        item.accessories as Array<Record<string, unknown>> | undefined
      )?.map((accessory) => ({
        name: accessory.name,
        priceDelta: accessory.price_delta,
      })),
    })),
  );
  return parsed.success ? parsed.data : [];
}

type JsonObject = { [key: string]: JsonValue };
type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

function mapItemsToPersistence(items: OrderItemSchema[]): JsonValue[] {
  return items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    accessories: item.accessories.map((accessory) => ({
      name: accessory.name,
      price_delta: accessory.priceDelta,
    })),
  }));
}
