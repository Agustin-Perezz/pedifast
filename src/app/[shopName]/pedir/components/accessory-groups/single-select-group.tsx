"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import type {
  PlainAccessoryGroup,
  PlainAccessoryOption,
} from "../../lib/serialize-catalog";
import { AccessoryOptionRow } from "./accessory-option-row";

type SingleSelectGroupProps = {
  readonly group: PlainAccessoryGroup;
  readonly selectedOptions: readonly number[];
  readonly onChange: (selectedOptions: readonly PlainAccessoryOption[]) => void;
};

export function SingleSelectGroup({
  group,
  selectedOptions,
  onChange,
}: SingleSelectGroupProps) {
  const selectedId = selectedOptions[0]?.toString() ?? "";

  return (
    <RadioGroup
      value={selectedId}
      onValueChange={(value) => {
        const option = group.options.find((o) => o.id === Number(value));
        onChange(option ? [option] : []);
      }}
      className="gap-2"
    >
      {group.options.map((option) => (
        <AccessoryOptionRow key={option.id} option={option} groupId={group.id}>
          <RadioGroupItem
            value={option.id.toString()}
            id={`${group.id}-${option.id}`}
          />
        </AccessoryOptionRow>
      ))}
    </RadioGroup>
  );
}
