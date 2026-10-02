"use client";

import { useMemo } from "react";
import {
  type CheckoutFormState,
  useCheckoutForm,
} from "../../components/checkout/use-checkout-form";
import type { PlainShopItem } from "../../lib/serialize-catalog";
import type { CartItemExtras } from "../components/item-extras-map";
import { buildItemExtrasMap } from "../components/item-extras-map";

export type PatchCheckoutForm = Partial<CheckoutFormState>;

export type CheckoutScreenState = {
  readonly form: CheckoutFormState;
  readonly update: (patch: PatchCheckoutForm) => void;
  readonly itemExtras: ReadonlyMap<number, CartItemExtras>;
};

export function useCheckoutScreen(
  catalogItems: readonly PlainShopItem[],
): CheckoutScreenState {
  const { form, update } = useCheckoutForm();
  const itemExtras = useMemo(
    () => buildItemExtrasMap(catalogItems),
    [catalogItems],
  );

  return { form, update, itemExtras };
}
