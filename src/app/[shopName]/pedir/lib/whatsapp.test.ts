import { describe, expect, it } from "vitest";

import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import { PaymentMethod } from "@/domain/entities/payment-method.enum";

import {
  buildWhatsappMessage,
  buildWhatsappUrl,
  type PendingWhatsappOrder,
} from "./whatsapp";

const BASE_ORDER: PendingWhatsappOrder = {
  shopName: "pizzeria-luca",
  whatsappPhone: "+54 9 3496 123-456",
  nombre: "Agustin",
  deliveryMethod: DeliveryMethod.Pickup,
  address: null,
  notas: null,
  paymentMethod: PaymentMethod.Efectivo,
  items: [
    {
      name: "Pizza Margherita (Mozzarella extra)",
      quantity: 2,
      unitPrice: 1300,
      accessories: [{ name: "Mozzarella extra", priceDelta: 300 }],
    },
  ],
  total: 2600,
};

describe("buildWhatsappMessage", () => {
  it("builds a pickup cash order message", () => {
    const message = buildWhatsappMessage(BASE_ORDER);

    expect(message).toContain("*Cliente:* Agustin");
    expect(message).toContain("*Entrega:* Retiro en local");
    expect(message).toContain("*Total:* $2.600");
    expect(message).toContain("*Pago:* Efectivo");
    expect(message).toContain(
      "2x Pizza Margherita (Mozzarella extra) - $1.300",
    );
  });

  it("includes the address for delivery orders", () => {
    const message = buildWhatsappMessage({
      ...BASE_ORDER,
      deliveryMethod: DeliveryMethod.Delivery,
      address: "Av. San Martin 123",
    });

    expect(message).toContain("*Entrega:* Envío a domicilio");
    expect(message).toContain("*Dirección:* Av. San Martin 123");
  });

  it("marks mercadopago as payment method", () => {
    const message = buildWhatsappMessage({
      ...BASE_ORDER,
      paymentMethod: PaymentMethod.MercadoPago,
    });

    expect(message).toContain("*Pago:* MercadoPago ✅");
  });

  it("appends notes when present", () => {
    const message = buildWhatsappMessage({
      ...BASE_ORDER,
      notas: "Sin cebolla",
    });

    expect(message).toContain("*Notas:* Sin cebolla");
  });

  it("sanitizes the phone and encodes the message in the url", () => {
    const url = buildWhatsappUrl("+54 9 3496 123-456", "🛍 *Nuevo pedido*");

    expect(url).toBe(
      "https://wa.me/5493496123456?text=%F0%9F%9B%8D%20*Nuevo%20pedido*",
    );
  });
});
