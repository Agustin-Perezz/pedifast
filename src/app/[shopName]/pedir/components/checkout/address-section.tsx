"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { PlainShop } from "../../lib/serialize-shop";
import { useCalculateDeliveryCost } from "./use-calculate-delivery-cost";

type AddressSectionProps = {
  readonly shop: PlainShop;
  readonly address: string;
  readonly onAddressChange: (address: string) => void;
  readonly onCostChange: (
    cost: number | null,
    distanceKm: number | null,
  ) => void;
};

export function AddressSection({
  shop,
  address,
  onAddressChange,
  onCostChange,
}: AddressSectionProps) {
  const [value, setValue] = useState(address);
  const { status, message, calculateCost } = useCalculateDeliveryCost(
    shop,
    onCostChange,
  );

  return (
    <div className="space-y-2" data-testid="address-section">
      <Label htmlFor="checkout-address">Dirección</Label>
      <div className="flex gap-2">
        <Input
          id="checkout-address"
          data-testid="checkout-address-input"
          value={value}
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
