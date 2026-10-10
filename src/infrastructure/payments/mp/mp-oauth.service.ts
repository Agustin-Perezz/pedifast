import { MercadoPagoConfig, OAuth } from "mercadopago";

import {
  mpAppId,
  mpClientSecret,
  mpOauthTestToken,
  mpRedirectUri,
} from "@/lib/shared/infrastructure/env";
import type { MpOAuthClient, MpOAuthTokens } from "./interfaces";
import { createOAuthState } from "./oauth-state";

export class MpOAuthService implements MpOAuthClient {
  private createConfig(): MercadoPagoConfig {
    return new MercadoPagoConfig({ accessToken: mpAppId });
  }

  getAuthorizationUrl(shopName: string): string {
    const oauth = new OAuth(this.createConfig());

    return oauth.getAuthorizationURL({
      options: {
        client_id: mpAppId,
        redirect_uri: mpRedirectUri,
        state: createOAuthState(shopName),
      },
    });
  }

  async exchangeCode(code: string): Promise<MpOAuthTokens> {
    const oauth = new OAuth(this.createConfig());
    const response = await oauth.create({
      body: {
        client_id: mpAppId,
        client_secret: mpClientSecret,
        code,
        redirect_uri: mpRedirectUri,
        test_token: mpOauthTestToken,
      } as never,
    });

    return {
      accessToken: response.access_token ?? "",
      refreshToken: response.refresh_token ?? "",
      expiresIn: response.expires_in ?? 0,
      userId: response.user_id ?? 0,
      publicKey: response.public_key ?? "",
    };
  }

  async refresh(
    refreshToken: string,
  ): Promise<Omit<MpOAuthTokens, "userId" | "publicKey">> {
    const oauth = new OAuth(this.createConfig());
    const response = await oauth.refresh({
      body: {
        client_id: mpAppId,
        client_secret: mpClientSecret,
        refresh_token: refreshToken,
        test_token: mpOauthTestToken,
      } as never,
    });

    return {
      accessToken: response.access_token ?? "",
      refreshToken: response.refresh_token ?? "",
      expiresIn: response.expires_in ?? 0,
    };
  }
}
