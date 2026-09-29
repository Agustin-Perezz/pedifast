import type { Order } from "@/domain/entities/order.entity";

import { AR_LOCALE } from "@/lib/utils/format";

const CONFIRMATION_GREETING = "Tu pedido fue *confirmado*.";
const CONFIRMATION_DETAIL_HEADER = "*Detalle:*";
const CONFIRMATION_TOTAL_LABEL = "*Total:*";
const CONFIRMATION_THANKS = "Gracias por tu compra!";

export function buildWhatsappUrl(phone: string, message: string): string {
  const sanitizedPhone = phone.replace(/[+\s-]/g, "");

  return `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(message)}`;
}

type ConfirmableOrder = {
  readonly customerName: string;
  readonly items: ReadonlyArray<{
    readonly name: string;
    readonly quantity: number;
  }>;
  readonly total: number;
};

export function buildCustomerConfirmationMessage(
  order: ConfirmableOrder,
): string {
  const itemLines = order.items
    .map((item) => `• ${item.quantity}x ${item.name}`)
    .join("\n");

  return [
    `Hola ${order.customerName}! ${CONFIRMATION_GREETING}`,
    "",
    CONFIRMATION_DETAIL_HEADER,
    itemLines,
    "",
    `${CONFIRMATION_TOTAL_LABEL} $${order.total.toLocaleString(AR_LOCALE)}`,
    "",
    CONFIRMATION_THANKS,
  ].join("\n");
}

export function buildOrderConfirmationWhatsappUrl(order: Order): string | null {
  const phone = order.customerPhone;

  if (!phone) {
    return null;
  }

  return buildWhatsappUrl(phone, buildCustomerConfirmationMessage(order));
}
