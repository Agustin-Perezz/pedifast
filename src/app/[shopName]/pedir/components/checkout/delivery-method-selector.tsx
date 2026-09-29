"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";

const PICKUP_LABEL = "Retiro en local";
const DELIVERY_LABEL = "Envío a domicilio";

type DeliveryMethodSelectorProps = {
  readonly value: DeliveryMethod;
  readonly onChange: (deliveryMethod: DeliveryMethod) => void;
};

export function DeliveryMethodSelector({
  value,
  onChange,
}: DeliveryMethodSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={(next) => onChange(next as DeliveryMethod)}
      className="flex gap-4"
      data-testid="delivery-method-selector"
    >
      <RadioOption
        value={DeliveryMethod.Pickup}
        label={PICKUP_LABEL}
        checked={value === DeliveryMethod.Pickup}
      />
      <RadioOption
        value={DeliveryMethod.Delivery}
        label={DELIVERY_LABEL}
        checked={value === DeliveryMethod.Delivery}
      />
    </RadioGroup>
  );
}

type RadioOptionProps = {
  readonly value: DeliveryMethod;
  readonly label: string;
  readonly checked: boolean;
};

function RadioOption({ value, label, checked }: RadioOptionProps) {
  return (
    <div className="flex items-center gap-2">
      <RadioGroupItem value={value} id={`delivery-${value}`} />
      <Label htmlFor={`delivery-${value}`}>{label}</Label>
      <span className="sr-only" data-testid={`delivery-method-${value}`}>
        {checked ? "selected" : ""}
      </span>
    </div>
  );
}
