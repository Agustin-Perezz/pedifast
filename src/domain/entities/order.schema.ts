import { z } from "zod";
import { DeliveryMethod } from "./delivery-method.enum";
import { orderItemSchema } from "./order-item.schema";
import { OrderStatus } from "./order-status.enum";
import { PaymentMethod } from "./payment-method.enum";
import { PaymentStatus } from "./payment-status.enum";

export const orderSchema = z.object({
  id: z.number().int().nonnegative(),
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
  total: z.coerce.number().nonnegative(),
  deliveryCost: z.coerce.number().nonnegative().default(0),
  status: z.nativeEnum(OrderStatus),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type OrderSchema = z.infer<typeof orderSchema>;
