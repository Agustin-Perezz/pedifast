import { z } from "zod";
import { PaymentStatus } from "@/domain/entities/payment-status.enum";

export const updateOrderPaymentStatusRequestDto = z.object({
  externalReference: z.string().min(1),
  paymentStatus: z.enum(PaymentStatus),
});

export type UpdateOrderPaymentStatusRequestDto = z.infer<
  typeof updateOrderPaymentStatusRequestDto
>;
