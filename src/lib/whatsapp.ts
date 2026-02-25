import {
  DeliveryMethod,
  PaymentMethod,
  type DeliveryMethodValue,
  type PaymentMethodValue
} from '$lib/schemas/order';

export interface PendingWhatsappOrder {
  shopName: string;
  whatsappPhone: string;
  nombre: string;
  deliveryMethod: DeliveryMethodValue;
  address?: string;
  notas?: string;
  paymentMethod: PaymentMethodValue;
  items: Array<{ name: string; quantity: number; unitPrice: number }>;
  total: number;
}

export function buildWhatsappMessage(order: PendingWhatsappOrder): string {
  const deliveryLabel =
    order.deliveryMethod === DeliveryMethod.enum.pickup
      ? 'Retiro en local'
      : 'Envío a domicilio';

  const paymentLabel =
    order.paymentMethod === PaymentMethod.enum.efectivo
      ? 'Efectivo'
      : 'MercadoPago ✅';

  const productLines = order.items
    .map(
      (item) =>
        `• ${item.quantity}x ${item.name} - $${item.unitPrice.toLocaleString('es-AR')}`
    )
    .join('\n');

  const lines = [
    '🛍 *Nuevo pedido*',
    '',
    `*Cliente:* ${order.nombre}`,
    `*Entrega:* ${deliveryLabel}`
  ];

  if (order.deliveryMethod === DeliveryMethod.enum.delivery && order.address) {
    lines.push(`*Dirección:* ${order.address}`);
  }

  lines.push('', '*Productos:*', productLines, '');
  lines.push(`*Total:* $${order.total.toLocaleString('es-AR')}`);
  lines.push(`*Pago:* ${paymentLabel}`);

  if (order.notas) {
    lines.push('', `*Notas:* ${order.notas}`);
  }

  return lines.join('\n');
}

export function buildWhatsappUrl(phone: string, message: string): string {
  const sanitizedPhone = phone.replace(/[+\s-]/g, '');
  return `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(message)}`;
}
