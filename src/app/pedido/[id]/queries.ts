import { GetSellerAccessTokenUseCase } from "@/application/use-cases/get-seller-access-token/get-seller-access-token.use-case";
import type { VerifyMpPaymentRepository } from "@/application/use-cases/verify-mp-payment/verify-mp-payment.repository.interface";
import { verifyMpPaymentRequestDto } from "@/application/use-cases/verify-mp-payment/verify-mp-payment.request.dto";
import { VerifyMpPaymentUseCase } from "@/application/use-cases/verify-mp-payment/verify-mp-payment.use-case";
import { SupabaseGetOrderRepository } from "@/infrastructure/database/postgres/repositories/orders/supabase-get-order.repository";
import { SupabaseUpdateOrderPaymentStatusRepository } from "@/infrastructure/database/postgres/repositories/orders/supabase-update-order-payment-status.repository";
import { SupabaseShopMpTokensRepository } from "@/infrastructure/database/postgres/repositories/shops/supabase-shop-mp-tokens.repository";
import { MpOAuthService } from "@/infrastructure/payments/mp/mp-oauth.service";
import { MpPaymentService } from "@/infrastructure/payments/mp/mp-payment.service";
import { MpPaymentGatewayAdapter } from "@/infrastructure/payments/mp/mp-payment-gateway.adapter";
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

  const getOrderRepository = new SupabaseGetOrderRepository(supabase);
  const updateOrderPaymentStatusRepository =
    new SupabaseUpdateOrderPaymentStatusRepository(supabase);

  const repository: VerifyMpPaymentRepository = {
    findByExternalReference:
      getOrderRepository.findByExternalReference.bind(getOrderRepository),
    updatePaymentStatus:
      updateOrderPaymentStatusRepository.updateByExternalReference.bind(
        updateOrderPaymentStatusRepository,
      ),
  };

  const getSellerAccessToken = new GetSellerAccessTokenUseCase(
    new SupabaseShopMpTokensRepository(supabase),
    new MpOAuthService(),
    EXPIRY_BUFFER_MS,
  );

  const gateway = new MpPaymentGatewayAdapter(
    getSellerAccessToken,
    new MpPaymentService(),
  );

  const useCase = new VerifyMpPaymentUseCase(repository, gateway);

  if (!parsed.success) {
    return useCase.execute({
      orderId: input.orderId,
      statusParam: null,
      paymentIdParam: null,
    });
  }

  return useCase.execute(parsed.data);
}
