"use client";

import type { CartItem } from "../../lib/cart-reducer";
import { nextSelectionAfterToggle } from "../../lib/next-selection-after-toggle";
import type {
  PlainAccessoryGroup,
  PlainAccessoryOption,
} from "../../lib/serialize-catalog";
import { AccessoryGroupHeader } from "./AccessoryGroupHeader";
import { AccessoryOptionPill } from "./AccessoryOptionPill";

export type AccessoryGroupPickerProps = {
  readonly item: CartItem;
  readonly group: PlainAccessoryGroup;
  readonly onSelect: (
    itemId: number,
    group: PlainAccessoryGroup,
    selectedOptions: readonly PlainAccessoryOption[],
  ) => void;
  readonly showMissingHint: boolean;
};

export function AccessoryGroupPicker({
  item,
  group,
  onSelect,
  showMissingHint,
}: AccessoryGroupPickerProps) {
  const selectedOptionIds = new Set(
    item.selectedAccessories
      .filter((accessory) => accessory.groupId === group.id)
      .map((accessory) => accessory.optionId),
  );

  function toggle(option: PlainAccessoryOption): void {
    const nextIds = nextSelectionAfterToggle(
      group,
      selectedOptionIds,
      option.id,
    );
    const selected = group.options.filter((optionCandidate) =>
      nextIds.includes(optionCandidate.id),
    );

    onSelect(item.product.id, group, selected);
  }

  return (
    <div
      className="flex flex-col gap-1.5"
      data-testid={`accessory-group-${group.id}`}
    >
      <AccessoryGroupHeader group={group} showMissingHint={showMissingHint} />
      <div className="flex flex-wrap gap-2">
        {group.options.map((option) => (
          <AccessoryOptionPill
            key={option.id}
            option={option}
            selected={selectedOptionIds.has(option.id)}
            isSingle={group.selectionMode === "single"}
            onToggle={() => toggle(option)}
          />
        ))}
      </div>
    </div>
  );
}
