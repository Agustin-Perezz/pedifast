import {
  calculateDeliveryCostAction,
  geocodeAddressAction,
} from "../../actions";

const SHOP_DEFAULT_LAT = 0;
const SHOP_DEFAULT_LNG = 0;

type FetchDeliveryCostInput = {
  readonly address: string;
  readonly pricePerKm: number;
};

export type DeliveryCostResult =
  | { ok: true; shippingCost: number; distanceKm: number }
  | { ok: false; error: string };

export async function fetchDeliveryCost({
  address,
  pricePerKm,
}: FetchDeliveryCostInput): Promise<DeliveryCostResult> {
  const geocode = await geocodeAddressAction({ address });

  if (!geocode.ok) {
    return geocode;
  }

  const cost = await calculateDeliveryCostAction({
    originLat: SHOP_DEFAULT_LAT,
    originLng: SHOP_DEFAULT_LNG,
    destLat: geocode.lat,
    destLng: geocode.lng,
    pricePerKm,
  });

  if (!cost.ok) {
    return cost;
  }

  return {
    ok: true,
    shippingCost: cost.shippingCost,
    distanceKm: cost.distanceKm,
  };
}
