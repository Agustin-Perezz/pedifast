import type { GetSellerAccessTokenRequestDto } from "@/application/use-cases/get-seller-access-token/get-seller-access-token.request.dto";
import type { GetSellerAccessTokenResponseDto } from "@/application/use-cases/get-seller-access-token/get-seller-access-token.response.dto";
import type { MpPaymentClient, MpPaymentStatusResult } from "./interfaces";
import type { MpPaymentGateway } from "./mp-payment-gateway.interface";

type GetSellerAccessTokenProvider = {
  execute(
    dto: GetSellerAccessTokenRequestDto,
  ): Promise<GetSellerAccessTokenResponseDto>;
};

// NOTE: I still don't gate why we need this adapter ? Also why three mp service classes ? when we can have only one with all the methods.
export class MpPaymentGatewayAdapter implements MpPaymentGateway {
  constructor(
    private readonly getSellerAccessToken: GetSellerAccessTokenProvider,
    private readonly mpPaymentClient: MpPaymentClient,
  ) {}

  async getPaymentStatus(
    shopName: string,
    paymentId: string,
  ): Promise<MpPaymentStatusResult> {
    const { accessToken } = await this.getSellerAccessToken.execute({
      shopName,
    });

    return this.mpPaymentClient.getPaymentStatusWithSellerToken(
      accessToken,
      paymentId,
    );
  }
}
