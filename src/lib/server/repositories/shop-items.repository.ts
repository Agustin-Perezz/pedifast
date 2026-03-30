import type { SupabaseClient } from '@supabase/supabase-js';
import { ProductMapper } from '$domain/mappers/product.mapper';
import type { Product } from '$domain/models/product';
import type { Database } from '$domain/types/database.types';

export class ShopItemsRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getItemWithAccessories(
    itemId: number
  ): Promise<{ product: Product; shopId: number } | null> {
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

    const accessoryGroups = ProductMapper.fromEntitiesToAccessoryGroups(
      data.accessory_groups
    );

    return {
      product: ProductMapper.fromEntityToProduct(data, accessoryGroups),
      shopId: data.shop_id
    };
  }
}
