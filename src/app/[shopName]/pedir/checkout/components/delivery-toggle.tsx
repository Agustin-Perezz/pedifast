"use client";

import { Bike, Store } from "lucide-react";

import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";

import { DELIVERY_LABEL, PICKUP_LABEL } from "../../lib/checkout-labels";

type DeliverySegmentedToggleProps = {
  readonly value: DeliveryMethod;
  readonly onChange: (deliveryMethod: DeliveryMethod) => void;
};

export function DeliverySegmentedToggle({
  value,
  onChange,
}: DeliverySegmentedToggleProps) {
  return (
    <div className="mt-4 flex items-center rounded-full bg-surface-container p-1">
      <ToggleTab
        active={value === DeliveryMethod.Delivery}
        label={DELIVERY_LABEL}
        testId="checkout-tab-delivery"
        onSelect={() => onChange(DeliveryMethod.Delivery)}
      />
      <ToggleTab
        active={value === DeliveryMethod.Pickup}
        label={PICKUP_LABEL}
        testId="checkout-tab-pickup"
        onSelect={() => onChange(DeliveryMethod.Pickup)}
      />
    </div>
  );
}

type ToggleTabProps = {
  readonly active: boolean;
  readonly label: string;
  readonly testId: string;
  readonly onSelect: () => void;
};

function ToggleTab({ active, label, testId, onSelect }: ToggleTabProps) {
  const Icon = label === DELIVERY_LABEL ? Bike : Store;
  const activeClass = active
    ? "bg-foreground text-background shadow-sm"
    : "text-muted-foreground hover:text-foreground";

  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={active}
      onClick={onSelect}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium ${activeClass}`}
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      {label}
    </button>
  );
}
