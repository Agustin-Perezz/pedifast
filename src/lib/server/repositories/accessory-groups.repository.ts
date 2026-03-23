import type { SupabaseClient } from '@supabase/supabase-js';

export interface RawAccessoryOption {
  id: number;
  name: string;
  price_delta: number;
  sort_order: number;
}

export interface RawAccessoryGroup {
  id: number;
  name: string;
  selection_mode: string;
  is_required: boolean;
  sort_order: number;
  accessory_options: RawAccessoryOption[];
}

export interface RawAccessoryGroupRow extends RawAccessoryGroup {
  shop_item_id: number;
}

export class AccessoryGroupsRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getByItemIds(itemIds: number[]): Promise<RawAccessoryGroupRow[]> {
    if (itemIds.length === 0) {
      return [];
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

    return (data ?? []) as RawAccessoryGroupRow[];
  }
}
