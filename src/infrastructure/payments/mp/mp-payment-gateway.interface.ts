import type { MpPaymentStatusResult } from "./interfaces";

export interface MpPaymentGateway {
  getPaymentStatus(
    shopName: string,
    paymentId: string,
  ): Promise<MpPaymentStatusResult>;
}
