import { describe, expect, it } from "vitest";
import { DeliveryMethod } from "./delivery-method.enum";
import { InvalidOrderError } from "./errors";
import { Order } from "./order.entity";
import { OrderStatus } from "./order-status.enum";
import { PaymentMethod } from "./payment-method.enum";
import { PaymentStatus } from "./payment-status.enum";
import { ShopItem } from "./shop-item.entity";
import { ShopItemCategory } from "./shop-item-category.enum";

describe("Order", () => {
  it("creates a valid order with derived defaults", () => {
    const order = Order.create({
      shopId: 1,
      externalReference: "pizzeria-luca-1700000000000",
      customerName: "Agustin",
      deliveryMethod: DeliveryMethod.Pickup,
      paymentMethod: PaymentMethod.Efectivo,
      paymentStatus: PaymentStatus.Approved,
      items: [],
      total: 0,
    });

    expect(order.status).toBe(OrderStatus.Pending);
    expect(order.deliveryCost).toBe(0);
    expect(order.paymentStatus).toBe(PaymentStatus.Approved);
  });

  it("derives approved payment status for cash", () => {
    expect(Order.derivePaymentStatus(PaymentMethod.Efectivo)).toBe(
      PaymentStatus.Approved,
    );
  });

  it("derives pending payment status for mercadopago", () => {
    expect(Order.derivePaymentStatus(PaymentMethod.MercadoPago)).toBe(
      PaymentStatus.Pending,
    );
  });

  it("rejects a negative total", () => {
    expect(() =>
      Order.create({
        shopId: 1,
        externalReference: "pizzeria-luca-1700000000000",
        customerName: "Agustin",
        deliveryMethod: DeliveryMethod.Pickup,
        paymentMethod: PaymentMethod.Efectivo,
        paymentStatus: PaymentStatus.Approved,
        items: [],
        total: -1,
      }),
    ).toThrow(InvalidOrderError);
  });

  it("formats an item name with accessories", () => {
    const name = Order.formatItemName("Hamburguesa", [
      "Doble carne",
      "Cheddar",
    ]);

    expect(name).toBe("Hamburguesa (Doble carne, Cheddar)");
  });

  it("returns the plain product name when no accessories are provided", () => {
    const name = Order.formatItemName("Hamburguesa", []);

    expect(name).toBe("Hamburguesa");
  });

  it("parses the external reference back into parts", () => {
    const order = Order.create({
      shopId: 1,
      externalReference: "pizzeria-luca-1700000000000",
      customerName: "Agustin",
      deliveryMethod: DeliveryMethod.Pickup,
      paymentMethod: PaymentMethod.Efectivo,
      paymentStatus: PaymentStatus.Approved,
      items: [],
      total: 0,
    });

    const reference = order.getExternalReference();

    expect(reference.shopName).toBe("pizzeria-luca");
    expect(reference.timestamp).toBe(1700000000000);
  });
});

describe("ShopItem", () => {
  it("rejects an unknown category value at the boundary", () => {
    expect(() =>
      ShopItem.create({
        shopId: 1,
        name: "Sushi roll",
        price: 100,
        category: "sushi" as ShopItemCategory,
        description: null,
      }),
    ).toThrow(InvalidOrderError);
  });

  it("accepts a valid category", () => {
    const item = ShopItem.create({
      shopId: 1,
      name: "Hamburguesa",
      price: 100,
      category: ShopItemCategory.Hamburguesas,
      description: null,
    });

    expect(item.category).toBe(ShopItemCategory.Hamburguesas);
  });
});
