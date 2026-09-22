import type { Order } from "@/domain/entities/order.entity";
import type { PaymentStatus } from "@/domain/entities/payment-status.enum";

export interface UpdateOrderPaymentStatusRepository {
  updateByExternalReference(
    externalReference: string,
    paymentStatus: PaymentStatus,
  ): Promise<Order | null>;
}
