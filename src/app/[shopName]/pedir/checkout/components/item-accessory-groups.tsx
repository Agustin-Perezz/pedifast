"use client";

import type { CartItem } from "../../lib/cart-reducer";
import type {
  PlainAccessoryGroup,
  PlainAccessoryOption,
} from "../../lib/serialize-catalog";
import { AccessoryGroupPicker } from "./accessory-group-picker";

export type ItemAccessoryGroupsProps = {
  readonly item: CartItem;
  readonly groups: readonly PlainAccessoryGroup[];
  readonly showMissingHints: boolean;
  readonly onSelectAccessories: (
    itemId: number,
    group: PlainAccessoryGroup,
    selectedOptions: readonly PlainAccessoryOption[],
  ) => void;
};

export function ItemAccessoryGroups({
  item,
  groups,
  showMissingHints,
  onSelectAccessories,
}: ItemAccessoryGroupsProps) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <div
      className="mt-2 flex flex-col gap-3 border-t border-surface-container pt-3"
      data-testid={`item-accessories-${item.product.id}`}
    >
      {groups.map((group) => (
        <AccessoryGroupPicker
          key={group.id}
          item={item}
          group={group}
          onSelect={onSelectAccessories}
          showMissingHint={showMissingHints}
        />
      ))}
    </div>
  );
}
