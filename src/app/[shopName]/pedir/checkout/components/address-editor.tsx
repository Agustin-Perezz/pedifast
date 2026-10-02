"use client";

import { AddressSection } from "../../components/checkout/address-section";
import type { PlainShop } from "../../lib/serialize-shop";

export type AddressEditorProps = {
  readonly shop: PlainShop;
  readonly address: string;
  readonly onAddressChange: (address: string) => void;
  readonly onCostChange: (cost: number | null) => void;
  readonly onSaved: () => void;
};

export function AddressEditor({
  shop,
  address,
  onAddressChange,
  onCostChange,
  onSaved,
}: AddressEditorProps) {
  return (
    <AddressSection
      shop={shop}
      address={address}
      onAddressChange={onAddressChange}
      onCostChange={(cost, _calculatedKm) => {
        onCostChange(cost);
        onSaved();
      }}
    />
  );
}
