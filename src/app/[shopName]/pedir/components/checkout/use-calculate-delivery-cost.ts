"use client";

import { useState } from "react";

import { AR_LOCALE } from "@/lib/utils/format";

import {
  calculateDeliveryCostAction,
  geocodeAddressAction,
} from "../../actions";
import type { PlainShop } from "../../lib/serialize-shop";

const SHOP_DEFAULT_LAT = 0;
const SHOP_DEFAULT_LNG = 0;

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

    const geocode = await geocodeAddressAction({ address: rawAddress });

    if (!geocode.ok) {
      setStatus("error");
      setMessage(geocode.error);
      onCostChange(null, null);

      return;
    }

    const cost = await calculateDeliveryCostAction({
      originLat: SHOP_DEFAULT_LAT,
      originLng: SHOP_DEFAULT_LNG,
      destLat: geocode.lat,
      destLng: geocode.lng,
      pricePerKm: shop.pricePerKm,
    });

    if (!cost.ok) {
      setStatus("error");
      setMessage(cost.error);
      onCostChange(null, null);

      return;
    }

    setStatus("done");
    setMessage(`Envío: $${cost.shippingCost.toLocaleString(AR_LOCALE)}`);
    onCostChange(cost.shippingCost, cost.distanceKm);
  }

  return { status, message, calculateCost };
}
