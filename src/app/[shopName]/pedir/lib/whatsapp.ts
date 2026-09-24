import type { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import type { PaymentMethod } from "@/domain/entities/payment-method.enum";

export type WhatsappOrderAccessory = {
  readonly name: string;
  readonly priceDelta: number;
};

export type PendingWhatsappOrder = {
  readonly shopName: string;
  readonly whatsappPhone: string;
  readonly nombre: string;
  readonly deliveryMethod: DeliveryMethod;
  readonly address: string | null;
  readonly notas: string | null;
  readonly paymentMethod: PaymentMethod;
  readonly items: readonly {
    readonly name: string;
    readonly quantity: number;
    readonly unitPrice: number;
    readonly accessories?: readonly WhatsappOrderAccessory[];
  }[];
  readonly total: number;
};

const PICKUP_LABEL = "Retiro en local";
const DELIVERY_LABEL = "Envío a domicilio";
const CASH_LABEL = "Efectivo";
const MP_LABEL = "MercadoPago ✅";

export { buildWhatsappUrl } from "@/lib/utils/whatsapp";

export function buildWhatsappMessage(order: PendingWhatsappOrder): string {
  const deliveryLabel =
    order.deliveryMethod === "pickup" ? PICKUP_LABEL : DELIVERY_LABEL;
  const paymentLabel =
    order.paymentMethod === "efectivo" ? CASH_LABEL : MP_LABEL;

  const productLines = order.items
    .map((item) => {
      const mainLine = `• ${item.quantity}x ${item.name} - $${item.unitPrice.toLocaleString("es-AR")}`;
      const accLines = (item.accessories ?? [])
        .filter((a) => a.priceDelta > 0)
        .map(
          (a) => `  └ ${a.name} (+$${a.priceDelta.toLocaleString("es-AR")})`,
        );

      return [mainLine, ...accLines].join("\n");
    })
    .join("\n");

  const lines = [
    "🛍 *Nuevo pedido*",
    "",
    `*Cliente:* ${order.nombre}`,
    `*Entrega:* ${deliveryLabel}`,
  ];

  if (order.deliveryMethod === "delivery" && order.address) {
    lines.push(`*Dirección:* ${order.address}`);
  }

  lines.push("", "*Productos:*", productLines, "");
  lines.push(`*Total:* $${order.total.toLocaleString("es-AR")}`);
  lines.push(`*Pago:* ${paymentLabel}`);

  if (order.notas) {
    lines.push("", `*Notas:* ${order.notas}`);
  }

  return lines.join("\n");
}
