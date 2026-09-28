import type { SupabaseClient } from "@supabase/supabase-js";
import type { VerifyMpPaymentRepository } from "@/application/use-cases/verify-mp-payment/verify-mp-payment.repository.interface";
import type { Order } from "@/domain/entities/order.entity";
import type { PaymentStatus } from "@/domain/entities/payment-status.enum";
import type { Database } from "../../database.types";
import { SupabaseShopMpTokensRepository } from "../shops/supabase-shop-mp-tokens.repository";
import { SupabaseGetOrderRepository } from "./supabase-get-order.repository";
import { SupabaseUpdateOrderPaymentStatusRepository } from "./supabase-update-order-payment-status.repository";

export class SupabaseVerifyMpPaymentRepository
  implements VerifyMpPaymentRepository
{
  constructor(
    private readonly supabase: SupabaseClient<Database>,
    private readonly dependencies: {
      readonly getSellerAccessToken: (shopName: string) => Promise<string>;
      readonly getPaymentStatusWithSellerToken: (
        sellerAccessToken: string,
        paymentId: string,
      ) => Promise<{ status: string; externalReference: string | null }>;
    },
  ) {}

  async findByExternalReference(
    externalReference: string,
  ): Promise<Order | null> {
    return new SupabaseGetOrderRepository(
      this.supabase,
    ).findByExternalReference(externalReference);
  }

  async updatePaymentStatus(
    externalReference: string,
    paymentStatus: string,
  ): Promise<Order | null> {
    return new SupabaseUpdateOrderPaymentStatusRepository(
      this.supabase,
    ).updateByExternalReference(
      externalReference,
      paymentStatus as PaymentStatus,
    );
  }

  async getSellerAccessToken(shopName: string): Promise<string> {
    const repository = new SupabaseShopMpTokensRepository(this.supabase);
    const result = await repository.findMpTokensByShopName(shopName);

    if (!result) {
      throw new Error(`Shop "${shopName}" not connected to Mercado Pago`);
    }

    return result.accessToken;
  }

  async getPaymentStatus(
    shopName: string,
    paymentId: string,
  ): Promise<{ status: string; externalReference: string | null }> {
    const sellerAccessToken = await this.getSellerAccessToken(shopName);

    return this.dependencies.getPaymentStatusWithSellerToken(
      sellerAccessToken,
      paymentId,
    );
  }
}
