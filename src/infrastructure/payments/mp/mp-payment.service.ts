import { MercadoPagoConfig, Payment } from "mercadopago";

import { PaymentStatus } from "@/domain/entities/payment-status.enum";
import type { MpPaymentClient, MpPaymentStatusResult } from "./interfaces";

export class MpPaymentService implements MpPaymentClient {
  async getPaymentStatusWithSellerToken(
    sellerAccessToken: string,
    paymentId: string,
  ): Promise<MpPaymentStatusResult> {
    const config = new MercadoPagoConfig({ accessToken: sellerAccessToken });
    const payment = await new Payment(config).get({ id: paymentId });

    return {
      status: payment.status ?? PaymentStatus.Pending,
      externalReference: payment.external_reference ?? null,
    };
  }
}
