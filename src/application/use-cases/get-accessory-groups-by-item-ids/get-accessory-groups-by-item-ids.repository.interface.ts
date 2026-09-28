import type { AccessoryGroupWithOptions } from "@/domain/entities/accessory-group-with-options";

export interface GetAccessoryGroupsByItemIdsRepository {
  findByItemIds(
    itemIds: number[],
  ): Promise<Map<number, AccessoryGroupWithOptions[]>>;
}
