import { NextResponse } from "next/server";

import { MpOAuthService } from "@/infrastructure/payments/mp/mp-oauth.service";

const MISSING_SHOP_ERROR = 'Missing "shop" query parameter';

export async function GET(request: Request): Promise<Response> {
  const shop = new URL(request.url).searchParams.get("shop");

  if (!shop) {
    return new Response(MISSING_SHOP_ERROR, { status: 400 });
  }

  const authUrl = new MpOAuthService().getAuthorizationUrl(shop);

  return NextResponse.redirect(authUrl, 302);
}
