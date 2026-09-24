import { z } from "zod";

export const verifyMpPaymentRequestDto = z.object({
  orderId: z.string().min(1),
  statusParam: z.string().nullish(),
  paymentIdParam: z.string().nullish(),
});

export type VerifyMpPaymentRequestDto = z.infer<
  typeof verifyMpPaymentRequestDto
>;
