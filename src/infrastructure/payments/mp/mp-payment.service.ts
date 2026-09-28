import { MercadoPagoConfig, Payment } from "mercadopago";

import type { MpPaymentClient, MpPaymentStatusResult } from "./interfaces";

export class MpPaymentService implements MpPaymentClient {
  async getPaymentStatusWithSellerToken(
    sellerAccessToken: string,
    paymentId: string,
  ): Promise<MpPaymentStatusResult> {
    const config = new MercadoPagoConfig({ accessToken: sellerAccessToken });
    const payment = await new Payment(config).get({ id: paymentId });

    return {
      status: payment.status ?? "pending",
      externalReference: payment.external_reference ?? null,
    };
  }
}
