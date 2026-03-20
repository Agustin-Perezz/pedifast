import { createHmac, timingSafeEqual } from 'crypto';
import { MercadoPagoConfig, OAuth, Payment, Preference } from 'mercadopago';
import type { PreferenceRequest } from 'mercadopago/dist/clients/preference/commonTypes';

import {
  MP_APP_ID,
  MP_CLIENT_SECRET,
  MP_OAUTH_STATE_SECRET,
  MP_REDIRECT_URI
} from './env';
import { supabase } from './supabase';

const EXPIRY_BUFFER_MS = 60 * 60 * 1000; // 1 hour
const STATE_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes

interface OAuthState {
  shop: string;
  timestamp: number;
  signature: string;
}

export interface OAuthTokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user_id: number;
  public_key: string;
}

export interface CreatePreferenceParams {
  shopName: string;
  items: {
    title: string;
    quantity: number;
    unit_price: number;
    currency_id: string;
  }[];
  nombre: string;
  notas: string;
  deliveryMethod: string;
  address: string;
  baseUrl: string;
}

export interface PreferenceResult {
  init_point: string;
  preference_id: string;
  externalReference: string;
}

export interface PaymentStatusResult {
  status: string;
  externalReference: string | undefined;
}

class MercadoPagoService {
  private createSellerClient(accessToken: string): MercadoPagoConfig {
    return new MercadoPagoConfig({ accessToken });
  }

  private createOAuthClient(): MercadoPagoConfig {
    return new MercadoPagoConfig({ accessToken: MP_APP_ID });
  }

  private async refreshSellerToken(
    shopName: string,
    refreshToken: string
  ): Promise<string> {
    const oauth = new OAuth(this.createOAuthClient());
    const tokenData = await oauth.refresh({
      body: {
        client_id: MP_APP_ID,
        client_secret: MP_CLIENT_SECRET,
        refresh_token: refreshToken
      }
    });

    const newExpiresAt = new Date(
      Date.now() + tokenData.expires_in! * 1000
    ).toISOString();

    const { error: updateError } = await supabase
      .from('shops')
      .update({
        mp_access_token: tokenData.access_token,
        mp_refresh_token: tokenData.refresh_token,
        mp_token_expires_at: newExpiresAt
      })
      .eq('shop_name', shopName);

    if (updateError) {
      console.error('Failed to update refreshed tokens:', updateError);
    }

    return tokenData.access_token!;
  }

  private signState(shop: string, timestamp: number): string {
    return createHmac('sha256', MP_OAUTH_STATE_SECRET)
      .update(`${shop}:${timestamp}`)
      .digest('hex');
  }

  getAuthorizationURL(shop: string): string {
    const timestamp = Date.now();
    const signature = this.signState(shop, timestamp);
    const state = Buffer.from(
      JSON.stringify({ shop, timestamp, signature })
    ).toString('base64url');

    const oauth = new OAuth(this.createOAuthClient());
    return oauth.getAuthorizationURL({
      options: {
        client_id: MP_APP_ID,
        redirect_uri: MP_REDIRECT_URI,
        state
      }
    });
  }

  validateOAuthState(stateParam: string): { shop: string } {
    let parsed: OAuthState;
    try {
      parsed = JSON.parse(
        Buffer.from(stateParam, 'base64url').toString('utf-8')
      );
      if (!parsed.shop || !parsed.timestamp || !parsed.signature) {
        throw new Error('Invalid state payload');
      }
    } catch {
      throw new Error('Invalid OAuth state');
    }

    if (Date.now() - parsed.timestamp > STATE_MAX_AGE_MS) {
      throw new Error('OAuth state expired');
    }

    const expectedSignature = this.signState(parsed.shop, parsed.timestamp);
    const sigBuffer = Buffer.from(parsed.signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (
      sigBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(sigBuffer, expectedBuffer)
    ) {
      throw new Error('Invalid OAuth state signature');
    }

    return { shop: parsed.shop };
  }

  async exchangeCodeForTokens(code: string): Promise<OAuthTokenData> {
    const oauth = new OAuth(this.createOAuthClient());
    const tokenData = await oauth.create({
      body: {
        client_id: MP_APP_ID,
        client_secret: MP_CLIENT_SECRET,
        code,
        redirect_uri: MP_REDIRECT_URI
      }
    });

    return {
      access_token: tokenData.access_token!,
      refresh_token: tokenData.refresh_token!,
      expires_in: tokenData.expires_in!,
      user_id: tokenData.user_id!,
      public_key: tokenData.public_key!
    };
  }

  async getSellerAccessToken(shopName: string): Promise<string> {
    const { data: shop, error } = await supabase
      .from('shops')
      .select('mp_access_token, mp_refresh_token, mp_token_expires_at')
      .eq('shop_name', shopName)
      .single();

    if (error || !shop) {
      throw new Error(
        `Shop "${shopName}" not found or not connected to Mercado Pago`
      );
    }

    const expiresAt = new Date(shop.mp_token_expires_at).getTime();
    const isExpired = Date.now() + EXPIRY_BUFFER_MS >= expiresAt;

    if (!isExpired) {
      return shop.mp_access_token;
    }

    return this.refreshSellerToken(shopName, shop.mp_refresh_token);
  }

  async createPreference(
    params: CreatePreferenceParams
  ): Promise<PreferenceResult> {
    const accessToken = await this.getSellerAccessToken(params.shopName);
    const externalReference = `${params.shopName}-${Date.now()}`;
    const resultUrl = `${params.baseUrl}/pedido/${externalReference}`;

    const preferenceBody: PreferenceRequest = {
      items: params.items.map((item) => ({
        id: '',
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: item.currency_id
      })),
      external_reference: externalReference,
      metadata: {
        shop_name: params.shopName,
        nombre: params.nombre,
        notas: params.notas,
        delivery_method: params.deliveryMethod,
        address: params.address
      }
    };

    if (!params.baseUrl.includes('localhost')) {
      preferenceBody.back_urls = {
        success: resultUrl,
        failure: resultUrl,
        pending: resultUrl
      };
      preferenceBody.auto_return = 'approved';
    }

    const client = this.createSellerClient(accessToken);
    const preference = await new Preference(client).create({
      body: preferenceBody
    });

    return {
      init_point: preference.init_point!,
      preference_id: preference.id!,
      externalReference
    };
  }

  async getPaymentStatus(
    shopName: string,
    paymentId: string
  ): Promise<PaymentStatusResult> {
    const accessToken = await this.getSellerAccessToken(shopName);
    const client = this.createSellerClient(accessToken);
    const payment = await new Payment(client).get({ id: paymentId });

    return {
      status: payment.status as string,
      externalReference: payment.external_reference
    };
  }
}

export const mpService = new MercadoPagoService();
