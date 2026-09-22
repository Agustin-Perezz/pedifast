import { AccessoryOption } from "@/domain/entities/accessory-option.entity";
import type {
  AccessoryOptionInsert,
  AccessoryOptionRow,
} from "../entities/accessory-option.entity";

export const accessoryOptionMapper = {
  toDomain(row: AccessoryOptionRow): AccessoryOption {
    return AccessoryOption.create({
      id: row.id,
      groupId: row.group_id,
      name: row.name,
      priceDelta: row.price_delta,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  },

  toPersistence(option: AccessoryOption): AccessoryOptionInsert {
    const props = option.toObject();
    return {
      group_id: props.groupId,
      name: props.name,
      price_delta: props.priceDelta,
      sort_order: props.sortOrder,
      created_at: props.createdAt,
      updated_at: props.updatedAt,
    };
  },
};
