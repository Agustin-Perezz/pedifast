"use client";

import { useState } from "react";

import { AR_LOCALE } from "@/lib/utils/format";

import type { PlainShop } from "../../lib/serialize-shop";
import { fetchDeliveryCost } from "./fetch-delivery-cost";

type CalculateStatus = "idle" | "calculating" | "error" | "done";

type CostChangeHandler = (
  cost: number | null,
  distanceKm: number | null,
) => void;

type UseCalculateDeliveryCostResult = {
  readonly status: CalculateStatus;
  readonly message: string | null;
  readonly calculateCost: (address: string) => Promise<void>;
};

export function useCalculateDeliveryCost(
  shop: PlainShop,
  onCostChange: CostChangeHandler,
): UseCalculateDeliveryCostResult {
  const [status, setStatus] = useState<CalculateStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function calculateCost(rawAddress: string) {
    setStatus("calculating");
    setMessage("Calculando...");

    const result = await fetchDeliveryCost({
      address: rawAddress,
      pricePerKm: shop.pricePerKm,
    });

    if (!result.ok) {
      setStatus("error");
      setMessage(result.error);
      onCostChange(null, null);

      return;
    }

    setStatus("done");
    setMessage(`Envío: $${result.shippingCost.toLocaleString(AR_LOCALE)}`);
    onCostChange(result.shippingCost, result.distanceKm);
  }

  return { status, message, calculateCost };
}
