import { z } from 'zod';

export const DeliveryMethod = z.enum(['pickup', 'delivery']);
export const PaymentMethod = z.enum(['mercadopago', 'efectivo']);

export const orderSchema = z
  .object({
    nombre: z.string().min(1, 'El nombre es requerido'),
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
  );

export type OrderFormData = z.infer<typeof orderSchema>;
export type PaymentMethodValue = z.infer<typeof PaymentMethod>;
