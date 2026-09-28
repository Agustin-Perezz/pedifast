import { describe, expect, it } from "vitest";
import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import { Order } from "@/domain/entities/order.entity";
import { OrderStatus } from "@/domain/entities/order-status.enum";
import { PaymentMethod } from "@/domain/entities/payment-method.enum";
import { PaymentStatus } from "@/domain/entities/payment-status.enum";
import type { OrderRow } from "../entities/order.entity";
import { orderMapper } from "./order.mapper";

const row: OrderRow = {
  id: 1,
  shop_id: 2,
  external_reference: "pizzeria-luca-1700000000000",
  customer_name: "Agustin",
  customer_phone: "+5491234567890",
  notes: "Sin cebolla",
  delivery_method: "delivery",
  address: "Av. San Martin 123",
  payment_method: "mercadopago",
  payment_status: "pending",
  items: [
    {
      name: "Pizza Margherita (Doble Queso)",
      quantity: 1,
      unit_price: 1500,
      accessories: [{ name: "Doble Queso", price_delta: 200 }],
    },
  ],
  total: 1700,
  delivery_cost: 450,
  status: "pending",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("orderMapper", () => {
  it("maps a persistence row to a domain Order with typed numeric fields", () => {
    const order = orderMapper.toDomain(row);

    expect(order.id).toBe(row.id);
    expect(order.shopId).toBe(row.shop_id);
    expect(order.externalReference).toBe(row.external_reference);
    expect(order.customerName).toBe(row.customer_name);
    expect(order.customerPhone).toBe(row.customer_phone);
    expect(order.notes).toBe(row.notes);
    expect(order.deliveryMethod).toBe(DeliveryMethod.Delivery);
    expect(order.address).toBe(row.address);
    expect(order.paymentMethod).toBe(PaymentMethod.MercadoPago);
    expect(order.paymentStatus).toBe(PaymentStatus.Pending);
    expect(order.total).toBe(1700);
    expect(order.deliveryCost).toBe(450);
    expect(order.status).toBe(OrderStatus.Pending);
    expect(order.items).toHaveLength(1);
    expect(order.items[0].name).toBe("Pizza Margherita (Doble Queso)");
    expect(order.items[0].accessories).toEqual([
      { name: "Doble Queso", priceDelta: 200 },
    ]);
  });

  it("maps a domain Order back to a persistence insert", () => {
    const order = orderMapper.toDomain(row);

    expect(orderMapper.toPersistence(order)).toEqual({
      shop_id: row.shop_id,
      external_reference: row.external_reference,
      customer_name: row.customer_name,
      customer_phone: row.customer_phone,
      notes: row.notes,
      delivery_method: row.delivery_method,
      address: row.address,
      payment_method: row.payment_method,
      payment_status: row.payment_status,
      items: row.items,
      total: row.total,
      delivery_cost: row.delivery_cost,
      status: row.status,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
  });

  it("round-trips an Order through persistence without loss", () => {
    const order = orderMapper.toDomain(row);
    const inserted = orderMapper.toPersistence(order);
    const restored = orderMapper.toDomain({
      ...row,
      items: inserted.items,
      total: inserted.total,
      delivery_cost: inserted.delivery_cost ?? 0,
    });

    expect(restored.toObject()).toEqual(order.toObject());
  });

  it("preserves an explicit id and timestamps on the domain entity", () => {
    const order = Order.create({
      id: row.id,
      shopId: row.shop_id,
      externalReference: row.external_reference,
      customerName: row.customer_name,
      deliveryMethod: DeliveryMethod.Delivery,
      paymentMethod: PaymentMethod.MercadoPago,
      paymentStatus: PaymentStatus.Pending,
      items: [
        {
          name: "Pizza Margherita (Doble Queso)",
          quantity: 1,
          unitPrice: 1500,
          accessories: [{ name: "Doble Queso", priceDelta: 200 }],
        },
      ],
      total: row.total,
      deliveryCost: row.delivery_cost,
      status: OrderStatus.Pending,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      customerPhone: row.customer_phone,
      notes: row.notes,
      address: row.address,
    });

    expect(order.toObject()).toMatchObject({
      id: row.id,
      externalReference: row.external_reference,
      total: row.total,
      deliveryCost: row.delivery_cost,
    });
  });
});
