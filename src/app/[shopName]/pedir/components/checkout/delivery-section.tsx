"use client";

import { useState } from "react";

import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import { AR_LOCALE } from "@/lib/utils/format";

import type { PlainShop } from "../../lib/serialize-shop";
import { AddressSection } from "./address-section";
import { DeliveryMethodSelector } from "./delivery-method-selector";

type DeliveryValues = {
  readonly deliveryMethod: DeliveryMethod;
  readonly address: string;
  readonly deliveryCost: number | null;
};

type DeliverySectionProps = {
  readonly shop: PlainShop;
  readonly values: DeliveryValues;
  readonly onChange: (patch: Partial<DeliveryValues>) => void;
};

export function DeliverySection({
  shop,
  values,
  onChange,
}: DeliverySectionProps) {
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  return (
    <div className="space-y-3" data-testid="delivery-section">
      <DeliveryMethodSelector
        value={values.deliveryMethod}
        onChange={(deliveryMethod) => onChange({ deliveryMethod })}
      />
      {values.deliveryMethod === DeliveryMethod.Delivery && (
        <AddressSection
          shop={shop}
          address={values.address}
          onCostChange={(cost, km) => {
            setDeliveryCost(cost);
            setDistanceKm(km);
            onChange({ deliveryCost: cost });
          }}
        />
      )}
      {deliveryCost !== null && distanceKm !== null && (
        <p className="text-sm text-zinc-500" data-testid="delivery-cost-label">
          Costo de envío: ${deliveryCost.toLocaleString(AR_LOCALE)} (
          {distanceKm} km)
        </p>
      )}
    </div>
  );
}
