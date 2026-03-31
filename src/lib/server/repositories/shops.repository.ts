import type { SupabaseClient } from '@supabase/supabase-js';
import { ProductMapper } from '$domain/mappers/product.mapper';
import { ShopMapper } from '$domain/mappers/shop.mapper';
import type {
  ShopMpOAuthTokensUpdate,
  ShopMpTokensUpdate
} from '$domain/models/shop';
import type { Database } from '$domain/types/database.types';

export class ShopsRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getShopWithItems(shopName: string) {
    const { data, error } = await this.supabase
      .from('shops')
      .select(
        'id, address, delivery_price, whatsapp_phone, display_name, logo_url, portrait_url, open_hours, lat, lng, price_per_km, order_flow, shop_items(id, name, price, category, images, description)'
      )
      .eq('shop_name', shopName)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      shop: ShopMapper.fromEntityToShop(data),
      products: ProductMapper.fromEntitiesToProducts(data.shop_items ?? [])
    };
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

  async getShopMeta(shopName: string) {
    const { data, error } = await this.supabase
      .from('shops')
      .select('id, shop_name, order_flow, dashboard_pin_hash')
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

    return data;
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

  async updateMpOAuthTokens(shopName: string, tokens: ShopMpOAuthTokensUpdate) {
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
