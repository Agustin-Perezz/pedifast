import type { SupabaseClient } from "@supabase/supabase-js";
import type { GetShopCatalogRepository } from "@/application/use-cases/get-shop-catalog/get-shop-catalog.repository.interface";
import type { ShopCatalog } from "@/application/use-cases/get-shop-catalog/get-shop-catalog.response.dto";
import type { AccessoryGroupWithOptions } from "@/domain/entities/accessory-group-with-options";
import type { AccessoryOption } from "@/domain/entities/accessory-option.entity";
import type { Database } from "../../database.types";
import type { AccessoryOptionRow } from "../../entities/accessory-option.entity";
import { accessoryGroupMapper } from "../../mappers/accessory-group.mapper";
import { accessoryOptionMapper } from "../../mappers/accessory-option.mapper";
import { shopMapper } from "../../mappers/shop.mapper";
import { shopItemMapper } from "../../mappers/shop-item.mapper";

export class SupabaseGetShopCatalogRepository
  implements GetShopCatalogRepository
{
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findByShopName(shopName: string): Promise<ShopCatalog | null> {
    const { data: shopRow, error: shopError } = await this.supabase
      .from("shops")
      .select("*")
      .eq("shop_name", shopName)
      .single();

    if (shopError || !shopRow) {
      return null;
    }

    const { data: itemRows, error: itemsError } = await this.supabase
      .from("shop_items")
      .select("*")
      .eq("shop_id", shopRow.id);

    if (itemsError) {
      throw new Error(`Failed to load shop items: ${itemsError.message}`);
    }

    const shop = shopMapper.toDomain(shopRow);
    const items = itemRows ?? [];

    if (items.length === 0) {
      return { shop, items: [] };
    }

    const accessoryGroups = await this.loadAccessoryGroupsByItemIds(
      items.map((item) => item.id),
    );

    const catalogItems = items.map((item) => ({
      item: shopItemMapper.toDomain(item),
      accessoryGroups: accessoryGroups.get(item.id) ?? [],
    }));

    return { shop, items: catalogItems };
  }

  private async loadAccessoryGroupsByItemIds(
    itemIds: number[],
  ): Promise<Map<number, AccessoryGroupWithOptions[]>> {
    const { data: groupRows, error: groupsError } = await this.supabase
      .from("accessory_groups")
      .select("*")
      .in("shop_item_id", itemIds);

    if (groupsError) {
      throw new Error(
        `Failed to load accessory groups: ${groupsError.message}`,
      );
    }

    const groups = groupRows ?? [];
    const optionRows =
      groups.length > 0
        ? await this.loadAccessoryOptionsByGroupIds(
            groups.map((group) => group.id),
          )
        : [];

    const optionsByGroupId = this.groupOptionsByGroupId(optionRows);

    const result = new Map<number, AccessoryGroupWithOptions[]>();

    for (const groupRow of groups) {
      const options = optionsByGroupId.get(groupRow.id) ?? [];
      const withOptions: AccessoryGroupWithOptions = {
        group: accessoryGroupMapper.toDomain(groupRow),
        options,
      };
      const existing = result.get(groupRow.shop_item_id) ?? [];
      existing.push(withOptions);
      result.set(groupRow.shop_item_id, existing);
    }

    return result;
  }

  private async loadAccessoryOptionsByGroupIds(
    groupIds: number[],
  ): Promise<AccessoryOptionRow[]> {
    const { data, error } = await this.supabase
      .from("accessory_options")
      .select("*")
      .in("group_id", groupIds);

    if (error) {
      throw new Error(`Failed to load accessory options: ${error.message}`);
    }

    return data ?? [];
  }

  private groupOptionsByGroupId(
    optionRows: AccessoryOptionRow[],
  ): Map<number, AccessoryOption[]> {
    const result = new Map<number, AccessoryOption[]>();

    for (const optionRow of optionRows) {
      const option = accessoryOptionMapper.toDomain(optionRow);
      const existing = result.get(optionRow.group_id) ?? [];
      existing.push(option);
      result.set(optionRow.group_id, existing);
    }

    return result;
  }
}
