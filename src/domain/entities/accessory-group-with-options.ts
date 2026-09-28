import type { AccessoryGroup } from "./accessory-group.entity";
import type { AccessoryOption } from "./accessory-option.entity";

export type AccessoryGroupWithOptions = {
  readonly group: AccessoryGroup;
  readonly options: readonly AccessoryOption[];
};
