import type { SupabaseClient } from '@supabase/supabase-js';

export class ShopItemsRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getItemWithAccessories(itemId: number) {
    const { data, error } = await this.supabase
      .from('shop_items')
      .select(
        'id, name, price, category, images, description, shop_id, accessory_groups(id, name, selection_mode, is_required, sort_order, accessory_options(id, name, price_delta, sort_order))'
      )
      .eq('id', itemId)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  }
}
