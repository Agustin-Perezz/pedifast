import type { SupabaseClient } from '@supabase/supabase-js';

import type { ShopMpTokensUpdate } from '$lib/types/shop';

export class ShopsRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getShopWithItems(shopName: string) {
    const { data, error } = await this.supabase
      .from('shops')
      .select(
        'id, address, delivery_price, whatsapp_phone, display_name, logo_url, portrait_url, open_hours, lat, lng, price_per_km, shop_items(id, name, price, category, images, description)'
      )
      .eq('shop_name', shopName)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  }

  async getShopId(shopName: string) {
    const { data, error } = await this.supabase
      .from('shops')
      .select('id')
      .eq('shop_name', shopName)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  }

  async getMpTokens(shopName: string) {
    const { data, error } = await this.supabase
      .from('shops')
      .select('mp_access_token, mp_refresh_token, mp_token_expires_at')
      .eq('shop_name', shopName)
      .single();

    if (error || !data) {
      return null;
    }

    return data as {
      mp_access_token: string;
      mp_refresh_token: string;
      mp_token_expires_at: string;
    };
  }

  async updateMpTokens(shopName: string, tokens: ShopMpTokensUpdate) {
    const { error, count } = await this.supabase
      .from('shops')
      .update(tokens)
      .eq('shop_name', shopName);

    if (error) {
      throw new Error(`Failed to update MP tokens: ${error.message}`);
    }

    return count;
  }

  async updateMpOAuthTokens(
    shopName: string,
    tokens: {
      mp_access_token: string;
      mp_refresh_token: string;
      mp_token_expires_at: string;
      mp_user_id: string;
      mp_public_key: string;
      connected_at: string;
    }
  ) {
    const { error, count } = await this.supabase
      .from('shops')
      .update(tokens)
      .eq('shop_name', shopName);

    if (error) {
      throw new Error(`Failed to update OAuth tokens: ${error.message}`);
    }

    return count;
  }
}
