import { z } from 'zod';

export const DeliveryMethod = z.enum(['pickup', 'delivery']);
export const PaymentMethod = z.enum(['mercadopago', 'efectivo']);
export const OrderFlow = z.enum(['whatsapp', 'dashboard']);
export const OrderStatus = z.enum(['pending', 'confirmed', 'rejected']);

export const MercadoPagoPaymentStatus = {
  approved: 'approved',
  rejected: 'rejected',
  pending: 'pending'
} as const;
export type MercadoPagoPaymentStatusValue =
  (typeof MercadoPagoPaymentStatus)[keyof typeof MercadoPagoPaymentStatus];

export function orderSchema(flow: OrderFlowValue = OrderFlow.enum.whatsapp) {
  return z
    .object({
      nombre: z.string().min(1, 'El nombre es requerido'),
      telefono: z.string().optional(),
      notas: z.string().optional(),
      deliveryMethod: DeliveryMethod.default('pickup'),
      address: z.string().optional(),
      paymentMethod: PaymentMethod.default('mercadopago')
    })
    .refine(
      (data) =>
        data.deliveryMethod !== DeliveryMethod.enum.delivery ||
        !!data.address?.trim(),
      {
        message: 'La dirección es requerida para envío a domicilio',
        path: ['address']
      }
    )
    .refine(
      (data) => flow !== OrderFlow.enum.dashboard || !!data.telefono?.trim(),
      {
        message: 'El teléfono es requerido',
        path: ['telefono']
      }
    );
}

export type OrderFormData = z.infer<ReturnType<typeof orderSchema>>;
export type DeliveryMethodValue = z.infer<typeof DeliveryMethod>;
export type PaymentMethodValue = z.infer<typeof PaymentMethod>;
export type OrderFlowValue = z.infer<typeof OrderFlow>;
export type OrderStatusValue = z.infer<typeof OrderStatus>;

const OrderItemAccessorySchema = z.object({
  name: z.string(),
  priceDelta: z.number()
});

const OrderItemSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  accessories: z.array(OrderItemAccessorySchema).optional()
});

export const OrderRowSchema = z
  .object({
    id: z.number(),
    shop_id: z.number(),
    external_reference: z.string(),
    customer_name: z.string(),
    customer_phone: z.string().nullable(),
    notes: z.string().nullable(),
    delivery_method: DeliveryMethod,
    address: z.string().nullable(),
    payment_method: PaymentMethod,
    payment_status: z.string(),
    items: z.array(OrderItemSchema),
    total: z.coerce.number(),
    delivery_cost: z.coerce.number(),
    status: OrderStatus,
    created_at: z.string()
  })
  .transform((row) => ({
    id: row.id,
    shopId: row.shop_id,
    externalReference: row.external_reference,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    notes: row.notes,
    deliveryMethod: row.delivery_method,
    address: row.address,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    items: row.items,
    total: row.total,
    deliveryCost: row.delivery_cost,
    status: row.status,
    createdAt: row.created_at
  }));
