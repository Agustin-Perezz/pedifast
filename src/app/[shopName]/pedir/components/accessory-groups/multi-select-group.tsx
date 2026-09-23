"use client";

import { Checkbox } from "@/components/ui/checkbox";

import type {
  PlainAccessoryGroup,
  PlainAccessoryOption,
} from "../../lib/serialize-catalog";
import { AccessoryOptionRow } from "./accessory-option-row";

type MultiSelectGroupProps = {
  readonly group: PlainAccessoryGroup;
  readonly selectedOptions: readonly number[];
  readonly onChange: (selectedOptions: readonly PlainAccessoryOption[]) => void;
};

export function MultiSelectGroup({
  group,
  selectedOptions,
  onChange,
}: MultiSelectGroupProps) {
  return (
    <>
      {group.options.map((option) => (
        <AccessoryOptionRow key={option.id} option={option} groupId={group.id}>
          <Checkbox
            id={`${group.id}-${option.id}`}
            checked={selectedOptions.includes(option.id)}
            onCheckedChange={() =>
              toggleOption(group.options, selectedOptions, option, onChange)
            }
          />
        </AccessoryOptionRow>
      ))}
    </>
  );
}

function toggleOption(
  options: readonly PlainAccessoryOption[],
  selectedOptions: readonly number[],
  option: PlainAccessoryOption,
  onChange: (selectedOptions: readonly PlainAccessoryOption[]) => void,
) {
  const nextIds = selectedOptions.includes(option.id)
    ? selectedOptions.filter((id) => id !== option.id)
    : [...selectedOptions, option.id];

  onChange(options.filter((o) => nextIds.includes(o.id)));
}
