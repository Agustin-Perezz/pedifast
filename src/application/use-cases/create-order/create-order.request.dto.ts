import { z } from "zod";
import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import { orderItemSchema } from "@/domain/entities/order-item.schema";
import { PaymentMethod } from "@/domain/entities/payment-method.enum";
import { PaymentStatus } from "@/domain/entities/payment-status.enum";

export const createOrderRequestDto = z.object({
  shopId: z.number().int().positive(),
  externalReference: z.string().min(1),
  customerName: z.string().min(1),
  customerPhone: z.string().nullable(),
  notes: z.string().nullable(),
  deliveryMethod: z.nativeEnum(DeliveryMethod),
  address: z.string().nullable(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  paymentStatus: z.nativeEnum(PaymentStatus),
  items: z.array(orderItemSchema),
  total: z.number().nonnegative(),
  deliveryCost: z.number().nonnegative(),
});

export type CreateOrderRequestDto = z.infer<typeof createOrderRequestDto>;
