import { AccessoryGroup } from "@/domain/entities/accessory-group.entity";
import type { AccessorySelectionMode } from "@/domain/entities/accessory-selection-mode.enum";
import type {
  AccessoryGroupInsert,
  AccessoryGroupRow,
} from "../entities/accessory-group.entity";

export const accessoryGroupMapper = {
  toDomain(row: AccessoryGroupRow): AccessoryGroup {
    return AccessoryGroup.create({
      id: row.id,
      shopItemId: row.shop_item_id,
      name: row.name,
      selectionMode: row.selection_mode as AccessorySelectionMode,
      isRequired: row.is_required,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  },

  toPersistence(group: AccessoryGroup): AccessoryGroupInsert {
    const props = group.toObject();
    return {
      shop_item_id: props.shopItemId,
      name: props.name,
      selection_mode: props.selectionMode,
      is_required: props.isRequired,
      sort_order: props.sortOrder,
      created_at: props.createdAt,
      updated_at: props.updatedAt,
    };
  },
};
