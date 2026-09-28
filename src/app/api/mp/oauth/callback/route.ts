import { NextResponse } from "next/server";

import { UpdateShopMpTokensUseCase } from "@/application/use-cases/update-shop-mp-tokens/update-shop-mp-tokens.use-case";
import { SupabaseUpdateShopMpTokensRepository } from "@/infrastructure/database/postgres/repositories/shops/supabase-update-shop-mp-tokens.repository";
import { MpOAuthService } from "@/infrastructure/payments/mp/mp-oauth.service";
import { validateOAuthState } from "@/infrastructure/payments/mp/oauth-state";
import { getSupabaseServiceRoleClient } from "@/lib/shared/infrastructure/supabase.service-role";

const MISSING_PARAMS_ERROR = 'Missing "code" or "state" parameter';

export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const code = params.get("code");
  const stateParam = params.get("state");

  if (!code || !stateParam) {
    return new Response(MISSING_PARAMS_ERROR, { status: 400 });
  }

  const shop = validateOAuthState(stateParam);

  if (!shop) {
    return new Response("OAuth state is invalid or expired", { status: 403 });
  }

  const oauth = new MpOAuthService();

  let tokens: Awaited<ReturnType<typeof oauth.exchangeCode>>;

  try {
    tokens = await oauth.exchangeCode(code);
  } catch {
    return new Response("Failed to exchange authorization code", {
      status: 502,
    });
  }

  const supabase = getSupabaseServiceRoleClient();
  const useCase = new UpdateShopMpTokensUseCase(
    new SupabaseUpdateShopMpTokensRepository(supabase),
  );

  const shopUpdated = await useCase.execute({
    shopName: shop,
    mpAccessToken: tokens.accessToken,
    mpRefreshToken: tokens.refreshToken,
    mpTokenExpiresAt: new Date(
      Date.now() + tokens.expiresIn * 1000,
    ).toISOString(),
    mpUserId: String(tokens.userId),
    mpPublicKey: tokens.publicKey,
    connectedAt: new Date().toISOString(),
  });

  if (!shopUpdated.shop) {
    return new Response(`Shop "${shop}" not found`, { status: 404 });
  }

  return NextResponse.redirect(
    new URL(`/${shop}/pedir?mp_connected=true`, request.url),
    302,
  );
}
