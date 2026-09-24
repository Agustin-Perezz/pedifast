import type { Order } from "@/domain/entities/order.entity";

export type VerifyMpPaymentRepository = {
  findByExternalReference(externalReference: string): Promise<Order | null>;
  updatePaymentStatus(
    externalReference: string,
    paymentStatus: string,
  ): Promise<Order | null>;
  getPaymentStatus(
    shopName: string,
    paymentId: string,
  ): Promise<{
    status: string;
    externalReference: string | null;
  }>;
  getSellerAccessToken(shopName: string): Promise<string>;
};
