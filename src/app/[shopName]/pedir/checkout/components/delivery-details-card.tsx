"use client";

import { useState } from "react";
import type { PlainShop } from "../../lib/serialize-shop";
import { AddressEditor } from "./address-editor";
import { AddressSummaryRow } from "./address-summary-row";
import { DriverNoteBox } from "./driver-note-box";
import { EtaRow } from "./eta-row";

export type DeliveryDetailsCardProps = {
  readonly shop: PlainShop;
  readonly address: string;
  readonly onAddressChange: (address: string) => void;
  readonly onCostChange: (cost: number | null) => void;
};

export function DeliveryDetailsCard({
  shop,
  address,
  onAddressChange,
  onCostChange,
}: DeliveryDetailsCardProps) {
  const [isEditing, setIsEditing] = useState(true);
  const showEditor = isEditing || address.length === 0;

  function handleCostCalculated(cost: number | null): void {
    onCostChange(cost);

    // Collapse to the summary only on success; on failure the editor stays
    // open so the error message from the calculation remains visible.
    if (cost !== null) {
      setIsEditing(false);
    }
  }

  return (
    <div
      className="mt-4 flex flex-col gap-3 rounded-xl bg-card p-4 shadow-sm"
      data-testid="delivery-details-card"
    >
      {showEditor ? (
        <AddressEditor
          shop={shop}
          address={address}
          onAddressChange={onAddressChange}
          onCostChange={handleCostCalculated}
          onSaved={() => setIsEditing(false)}
        />
      ) : (
        <AddressSummaryRow address={address} />
      )}
      <DriverNoteBox />
      <EtaRow />
    </div>
  );
}
