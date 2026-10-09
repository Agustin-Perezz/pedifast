"use client";

import type { PlainShop } from "../../lib/serialize-shop";
import { AddressSection } from "./AddressSection";

export type AddressEditorProps = {
  readonly shop: PlainShop;
  readonly address: string;
  readonly onAddressChange: (address: string) => void;
  readonly onCostChange: (cost: number | null) => void;
  readonly onSaved: () => void;
  readonly error: string | null;
};

export function AddressEditor({
  shop,
  address,
  onAddressChange,
  onCostChange,
  onSaved,
  error,
}: AddressEditorProps) {
  return (
    <AddressSection
      shop={shop}
      address={address}
      onAddressChange={onAddressChange}
      onCostChange={(cost: number | null, _calculatedKm: number | null) => {
        onCostChange(cost);
        onSaved();
      }}
      error={error}
    />
  );
}
