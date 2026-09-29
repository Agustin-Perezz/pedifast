"use client";

import { AccessorySelectionMode } from "@/domain/entities/accessory-selection-mode.enum";
import type {
  PlainAccessoryGroup,
  PlainAccessoryOption,
} from "../lib/serialize-catalog";
import { MultiSelectGroup } from "./accessory-groups/multi-select-group";
import { SingleSelectGroup } from "./accessory-groups/single-select-group";

type AccessoryGroupSectionProps = {
  readonly group: PlainAccessoryGroup;
  readonly selectedOptions: readonly number[];
  readonly onChange: (selectedOptions: readonly PlainAccessoryOption[]) => void;
};

export function AccessoryGroupSection({
  group,
  selectedOptions,
  onChange,
}: AccessoryGroupSectionProps) {
  return group.selectionMode === AccessorySelectionMode.Single ? (
    <SingleSelectGroup
      group={group}
      selectedOptions={selectedOptions}
      onChange={onChange}
    />
  ) : (
    <MultiSelectGroup
      group={group}
      selectedOptions={selectedOptions}
      onChange={onChange}
    />
  );
}
