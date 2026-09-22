import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  GetShopItemByIdRepository,
  ShopItemWithAccessories,
} from "@/application/use-cases/get-shop-item-by-id/get-shop-item-by-id.repository.interface";
import type { Database } from "../../database.types";
import type { AccessoryGroupRow } from "../../entities/accessory-group.entity";
import type { AccessoryOptionRow } from "../../entities/accessory-option.entity";
import type { ShopItemRow } from "../../entities/shop-item.entity";
import { accessoryGroupMapper } from "../../mappers/accessory-group.mapper";
import { accessoryOptionMapper } from "../../mappers/accessory-option.mapper";
import { shopItemMapper } from "../../mappers/shop-item.mapper";

type ShopItemWithGroupsRow = ShopItemRow & {
  accessory_groups: AccessoryGroupWithOptionsRow[];
};

type AccessoryGroupWithOptionsRow = AccessoryGroupRow & {
  accessory_options: AccessoryOptionRow[];
};

export class SupabaseGetShopItemByIdRepository
  implements GetShopItemByIdRepository
{
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findById(itemId: number): Promise<ShopItemWithAccessories | null> {
    const { data, error } = await this.supabase
      .from("shop_items")
      .select(
        "id, shop_id, name, price, category, images, description, created_at, updated_at, accessory_groups!accessory_groups_shop_item_id_fkey(id, shop_item_id, name, selection_mode, is_required, sort_order, created_at, updated_at, accessory_options!accessory_options_group_id_fkey(id, group_id, name, price_delta, sort_order, created_at, updated_at))",
      )
      .eq("id", itemId)
      .single();

    if (error || !data) {
      return null;
    }

    const row = data as unknown as ShopItemWithGroupsRow;
    const item = shopItemMapper.toDomain(row);
    const accessoryGroups = (row.accessory_groups ?? []).map((groupRow) => ({
      group: accessoryGroupMapper.toDomain(groupRow),
      options: (groupRow.accessory_options ?? []).map((optionRow) =>
        accessoryOptionMapper.toDomain(optionRow),
      ),
    }));

    return { item, accessoryGroups };
  }
}
