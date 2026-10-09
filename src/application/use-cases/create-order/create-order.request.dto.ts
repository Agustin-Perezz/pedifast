import { z } from "zod";
import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import type { OrderFlow } from "@/domain/entities/order-flow.enum";
import { orderItemSchema } from "@/domain/entities/order-item.schema";
import { PaymentMethod } from "@/domain/entities/payment-method.enum";

export const createOrderRequestDto = z
  .object({
    shopName: z.string().min(1),
    customerName: z.string().min(1),
    customerPhone: z.string().min(1).nullable(),
    notes: z.string().nullable(),
    deliveryMethod: z.enum(DeliveryMethod),
    address: z.string().min(1).nullable(),
    paymentMethod: z.enum(PaymentMethod),
    items: z.array(orderItemSchema),
    deliveryCost: z.number().nonnegative(),
  })
  .superRefine((value, ctx) => {
    if (
      value.deliveryMethod === DeliveryMethod.Delivery &&
      (value.address === null || value.customerPhone === null)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "Address is required for delivery orders",
      });
    }
  });

export type CreateOrderRequestDto = z.infer<typeof createOrderRequestDto>;

export type CreateOrderInput = {
  readonly shopName: string;
  readonly orderFlow: OrderFlow;
  readonly shopId: number;
  readonly payload: CreateOrderRequestDto;
};
