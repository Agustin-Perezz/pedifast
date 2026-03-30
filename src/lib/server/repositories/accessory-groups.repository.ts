import type { SupabaseClient } from '@supabase/supabase-js';
import { ProductMapper } from '$domain/mappers/product.mapper';
import type { AccessoryGroup } from '$domain/models/product';
import type { Database } from '$domain/types/database.types';

export class AccessoryGroupsRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getByItemIds(
    itemIds: number[]
  ): Promise<Map<number, AccessoryGroup[]>> {
    if (itemIds.length === 0) {
      return new Map();
    }

    const { data, error } = await this.supabase
      .from('accessory_groups')
      .select(
        'id, shop_item_id, name, selection_mode, is_required, sort_order, accessory_options(id, name, price_delta, sort_order)'
      )
      .in('shop_item_id', itemIds);

    if (error) {
      throw new Error(`Failed to load accessory groups: ${error.message}`);
    }

    const result = new Map<number, AccessoryGroup[]>();

    for (const row of data ?? []) {
      const mapped = ProductMapper.fromEntitiesToAccessoryGroups([row]);
      if (mapped) {
        const existing = result.get(row.shop_item_id) ?? [];
        existing.push(...mapped);
        result.set(row.shop_item_id, existing);
      }
    }

    return result;
  }
}
