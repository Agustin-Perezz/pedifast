import { GetSellerAccessTokenUseCase } from "@/application/use-cases/get-seller-access-token/get-seller-access-token.use-case";
import { verifyMpPaymentRequestDto } from "@/application/use-cases/verify-mp-payment/verify-mp-payment.request.dto";
import { VerifyMpPaymentUseCase } from "@/application/use-cases/verify-mp-payment/verify-mp-payment.use-case";
import { SupabaseVerifyMpPaymentRepository } from "@/infrastructure/database/postgres/repositories/orders/supabase-verify-mp-payment.repository";
import { SupabaseShopMpTokensRepository } from "@/infrastructure/database/postgres/repositories/shops/supabase-shop-mp-tokens.repository";
import { MpOAuthService } from "@/infrastructure/payments/mp/mp-oauth.service";
import { MpPaymentService } from "@/infrastructure/payments/mp/mp-payment.service";
import { EXPIRY_BUFFER_MS } from "@/infrastructure/payments/mp/oauth-state";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

export async function verifyReceiptPayment(input: {
  orderId: string;
  searchParams: URLSearchParams;
}) {
  const parsed = verifyMpPaymentRequestDto.safeParse({
    orderId: input.orderId,
    statusParam:
      input.searchParams.get("status") ??
      input.searchParams.get("collection_status"),
    paymentIdParam: input.searchParams.get("payment_id"),
  });

  const supabase = await createSupabaseServerClient();
  const tokensRepository = new SupabaseShopMpTokensRepository(supabase);
  const getSellerAccessToken = new GetSellerAccessTokenUseCase(
    tokensRepository,
    new MpOAuthService(),
    EXPIRY_BUFFER_MS,
  );

  const repository = new SupabaseVerifyMpPaymentRepository(supabase, {
    getSellerAccessToken: (shopName) =>
      getSellerAccessToken
        .execute({ shopName })
        .then((result) => result.accessToken),
    getPaymentStatusWithSellerToken: (token, paymentId) =>
      new MpPaymentService().getPaymentStatusWithSellerToken(token, paymentId),
  });

  const useCase = new VerifyMpPaymentUseCase(repository);

  if (!parsed.success) {
    return useCase.execute({
      orderId: input.orderId,
      statusParam: null,
      paymentIdParam: null,
    });
  }

  return useCase.execute(parsed.data);
}
