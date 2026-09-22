"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { AccessoryGroupWithOptions } from "@/domain/entities/accessory-group-with-options";
import type { AccessoryOption } from "@/domain/entities/accessory-option.entity";
import { AccessorySelectionMode } from "@/domain/entities/accessory-selection-mode.enum";

type AccessoryGroupSectionProps = {
  readonly group: AccessoryGroupWithOptions;
  readonly selectedOptions: readonly number[];
  readonly onChange: (selectedOptions: readonly AccessoryOption[]) => void;
};

export function AccessoryGroupSection({
  group,
  selectedOptions,
  onChange,
}: AccessoryGroupSectionProps) {
  const { group: accessoryGroup, options } = group;
  const baseProps = { accessoryGroup, options, selectedOptions, onChange };

  return accessoryGroup.selectionMode === AccessorySelectionMode.Single ? (
    <SingleSelectGroup {...baseProps} />
  ) : (
    <MultiSelectGroup {...baseProps} />
  );
}

type GroupBaseProps = {
  readonly accessoryGroup: AccessoryGroupWithOptions["group"];
  readonly options: readonly AccessoryOption[];
  readonly selectedOptions: readonly number[];
  readonly onChange: (selectedOptions: readonly AccessoryOption[]) => void;
};

function SingleSelectGroup({
  accessoryGroup,
  options,
  selectedOptions,
  onChange,
}: GroupBaseProps) {
  const selectedId = selectedOptions[0]?.toString() ?? "";

  return (
    <OptionGroup
      name={accessoryGroup.name}
      isRequired={accessoryGroup.isRequired}
    >
      <RadioGroup
        value={selectedId}
        onValueChange={(value) => {
          const option = options.find((o) => o.id === Number(value));
          onChange(option ? [option] : []);
        }}
        className="gap-2"
      >
        {options.map((option) => (
          <OptionRow
            key={option.id}
            option={option}
            groupId={accessoryGroup.id}
          >
            <RadioGroupItem
              value={option.id.toString()}
              id={`${accessoryGroup.id}-${option.id}`}
            />
          </OptionRow>
        ))}
      </RadioGroup>
    </OptionGroup>
  );
}

function MultiSelectGroup({
  accessoryGroup,
  options,
  selectedOptions,
  onChange,
}: GroupBaseProps) {
  return (
    <OptionGroup
      name={accessoryGroup.name}
      isRequired={accessoryGroup.isRequired}
    >
      {options.map((option) => (
        <OptionRow key={option.id} option={option} groupId={accessoryGroup.id}>
          <Checkbox
            id={`${accessoryGroup.id}-${option.id}`}
            checked={selectedOptions.includes(option.id)}
            onCheckedChange={() =>
              toggleOption(options, selectedOptions, option, onChange)
            }
          />
        </OptionRow>
      ))}
    </OptionGroup>
  );
}

function OptionGroup({
  name,
  isRequired,
  children,
}: {
  readonly name: string;
  readonly isRequired: boolean;
  readonly children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        {name}
        {isRequired && <span className="text-destructive ml-1">*</span>}
      </p>
      {children}
    </div>
  );
}

function OptionRow({
  option,
  groupId,
  children,
}: {
  readonly option: AccessoryOption;
  readonly groupId: number;
  readonly children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      {children}
      <Label htmlFor={`${groupId}-${option.id}`}>
        <AccessoryOptionLabel option={option} />
      </Label>
    </div>
  );
}

function AccessoryOptionLabel({
  option,
}: {
  readonly option: AccessoryOption;
}) {
  return (
    <>
      {option.name}{" "}
      {option.priceDelta > 0 && `(+${formatPrice(option.priceDelta)})`}
    </>
  );
}

function toggleOption(
  options: readonly AccessoryOption[],
  selectedOptions: readonly number[],
  option: AccessoryOption,
  onChange: (selectedOptions: readonly AccessoryOption[]) => void,
) {
  const nextIds = selectedOptions.includes(option.id)
    ? selectedOptions.filter((id) => id !== option.id)
    : [...selectedOptions, option.id];

  onChange(options.filter((o) => nextIds.includes(o.id)));
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`;
}
