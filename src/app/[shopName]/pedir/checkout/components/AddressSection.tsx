"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldErrorText } from "../../components/FieldErrorText";
import { useCalculateDeliveryCost } from "../../hooks/useCalculateDeliveryCost";
import type { PlainShop } from "../../lib/serialize-shop";

type AddressSectionProps = {
  readonly shop: PlainShop;
  readonly address: string;
  readonly onAddressChange: (address: string) => void;
  readonly onCostChange: (
    cost: number | null,
    distanceKm: number | null,
  ) => void;
  readonly error: string | null;
};

export function AddressSection({
  shop,
  address,
  onAddressChange,
  onCostChange,
  error,
}: AddressSectionProps) {
  const [value, setValue] = useState(address);
  const { status, message, calculateCost } = useCalculateDeliveryCost(
    shop,
    onCostChange,
  );

  return (
    <div className="space-y-2" data-testid="AddressSection">
      <Label htmlFor="checkout-address">Dirección</Label>
      <div className="flex gap-2">
        <Input
          id="checkout-address"
          data-testid="checkout-address-input"
          value={value}
          aria-invalid={error !== null}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Calle y número"
        />
        <Button
          type="button"
          variant="outline"
          data-testid="calculate-delivery-button"
          disabled={status === "calculating" || value.length === 0}
          onClick={() => {
            onAddressChange(value);
            void calculateCost(value);
          }}
        >
          {status === "calculating" ? "..." : "Calcular"}
        </Button>
      </div>
      <FieldErrorText message={error} />
      {message && (
        <p
          className="text-sm text-muted-foreground"
          data-testid="delivery-status"
        >
          {message}
        </p>
      )}
    </div>
  );
}
