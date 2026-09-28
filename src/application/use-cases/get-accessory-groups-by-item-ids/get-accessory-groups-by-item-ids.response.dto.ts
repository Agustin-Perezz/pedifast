import type { AccessoryGroupWithOptions } from "@/domain/entities/accessory-group-with-options";

export type GetAccessoryGroupsByItemIdsResponseDto = {
  readonly groupsByItemId: Map<number, AccessoryGroupWithOptions[]>;
};
