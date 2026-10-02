"use client";

import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";

import { DELIVERY_LABEL, PICKUP_LABEL } from "../../lib/checkout-labels";
import { ToggleTab } from "./toggle-tab";

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
