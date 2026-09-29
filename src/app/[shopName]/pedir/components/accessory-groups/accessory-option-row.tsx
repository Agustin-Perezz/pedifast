"use client";

import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils/format";

import type { PlainAccessoryOption } from "../../lib/serialize-catalog";

type AccessoryOptionRowProps = {
  readonly option: PlainAccessoryOption;
  readonly groupId: number;
  readonly children: React.ReactNode;
};

export function AccessoryOptionRow({
  option,
  groupId,
  children,
}: AccessoryOptionRowProps) {
  const rowId = `${groupId}-${option.id}`;

  return (
    <div className="flex items-center gap-2">
      {children}
      <Label htmlFor={rowId} data-testid={`accessory-option-${rowId}`}>
        {option.name}{" "}
        {option.priceDelta > 0 && `(+${formatPrice(option.priceDelta)})`}
      </Label>
    </div>
  );
}
