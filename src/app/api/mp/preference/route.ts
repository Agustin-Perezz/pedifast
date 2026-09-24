import { createMpPreferenceRequestDto } from "@/application/use-cases/create-mp-preference/create-mp-preference.request.dto";
import { CreateMpPreferenceUseCase } from "@/application/use-cases/create-mp-preference/create-mp-preference.use-case";
import {
  GetSellerAccessTokenUseCase,
  ShopNotConnectedToMpError,
} from "@/application/use-cases/get-seller-access-token/get-seller-access-token.use-case";
import { SupabaseShopMpTokensRepository } from "@/infrastructure/database/postgres/repositories/shops/supabase-shop-mp-tokens.repository";
import { MpOAuthService } from "@/infrastructure/payments/mp/mp-oauth.service";
import { MpPreferenceService } from "@/infrastructure/payments/mp/mp-preference.service";
import { EXPIRY_BUFFER_MS } from "@/infrastructure/payments/mp/oauth-state";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

const INVALID_JSON_ERROR = "Invalid JSON";

export async function POST(request: Request): Promise<Response> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: INVALID_JSON_ERROR }, { status: 400 });
  }

  const parsed = createMpPreferenceRequestDto.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid preference request" },
      { status: 400 },
    );
  }

  try {
    const supabase = await createSupabaseServerClient();
    const tokensRepository = new SupabaseShopMpTokensRepository(supabase);

    const getSellerAccessToken = new GetSellerAccessTokenUseCase(
      tokensRepository,
      new MpOAuthService(),
      EXPIRY_BUFFER_MS,
    );

    const useCase = new CreateMpPreferenceUseCase({
      getSellerAccessToken: (shopName) =>
        getSellerAccessToken.execute({ shopName }).then((r) => r.accessToken),
      createPreference: (sellerAccessToken, mpRequest, externalReference) =>
        new MpPreferenceService().createWithSellerToken(
          sellerAccessToken,
          mpRequest as never,
          externalReference,
        ),
    });

    const result = await useCase.execute(parsed.data);

    return Response.json(result);
  } catch (error) {
    if (error instanceof ShopNotConnectedToMpError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json(
      { error: "Failed to create payment preference" },
      { status: 502 },
    );
  }
}
