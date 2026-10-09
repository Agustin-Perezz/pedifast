import type { Order } from "@/domain/entities/order.entity";
import type { PaymentStatus } from "@/domain/entities/payment-status.enum";

export interface VerifyMpPaymentRepository {
  findByExternalReference(externalReference: string): Promise<Order | null>;
  updatePaymentStatus(
    externalReference: string,
    paymentStatus: PaymentStatus,
  ): Promise<Order | null>;
}
