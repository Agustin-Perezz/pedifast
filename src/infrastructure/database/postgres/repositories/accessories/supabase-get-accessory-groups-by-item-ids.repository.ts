import type { SupabaseClient } from "@supabase/supabase-js";
import type { GetAccessoryGroupsByItemIdsRepository } from "@/application/use-cases/get-accessory-groups-by-item-ids/get-accessory-groups-by-item-ids.repository.interface";
import type { AccessoryGroupWithOptions } from "@/domain/entities/accessory-group-with-options";
import type { AccessoryOption } from "@/domain/entities/accessory-option.entity";
import type { Database } from "../../database.types";
import type { AccessoryGroupRow } from "../../entities/accessory-group.entity";
import type { AccessoryOptionRow } from "../../entities/accessory-option.entity";
import { accessoryGroupMapper } from "../../mappers/accessory-group.mapper";
import { accessoryOptionMapper } from "../../mappers/accessory-option.mapper";

export class SupabaseGetAccessoryGroupsByItemIdsRepository
  implements GetAccessoryGroupsByItemIdsRepository
{
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findByItemIds(
    itemIds: number[],
  ): Promise<Map<number, AccessoryGroupWithOptions[]>> {
    if (itemIds.length === 0) {
      return new Map();
    }

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

    return this.groupOptionsByGroupId(groups, optionRows);
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
    groupRows: AccessoryGroupRow[],
    optionRows: AccessoryOptionRow[],
  ): Map<number, AccessoryGroupWithOptions[]> {
    const optionsByGroupId = new Map<number, AccessoryOption[]>();

    for (const optionRow of optionRows) {
      const option = accessoryOptionMapper.toDomain(optionRow);
      const existing = optionsByGroupId.get(optionRow.group_id) ?? [];
      existing.push(option);
      optionsByGroupId.set(optionRow.group_id, existing);
    }

    const result = new Map<number, AccessoryGroupWithOptions[]>();

    for (const groupRow of groupRows) {
      const withOptions: AccessoryGroupWithOptions = {
        group: accessoryGroupMapper.toDomain(groupRow),
        options: optionsByGroupId.get(groupRow.id) ?? [],
      };
      const existing = result.get(groupRow.shop_item_id) ?? [];
      existing.push(withOptions);
      result.set(groupRow.shop_item_id, existing);
    }

    return result;
  }
}
