"use client";

import { useMemo } from "react";
import {
  type CheckoutFormState,
  useCheckoutForm,
} from "../../components/checkout/use-checkout-form";
import type {
  PlainAccessoryGroup,
  PlainShopItem,
} from "../../lib/serialize-catalog";
import type { CartItemExtras } from "../components/item-extras-map";
import { buildItemExtrasMap } from "../components/item-extras-map";

export type PatchCheckoutForm = Partial<CheckoutFormState>;

export type CheckoutScreenState = {
  readonly form: CheckoutFormState;
  readonly update: (patch: PatchCheckoutForm) => void;
  readonly itemExtras: ReadonlyMap<number, CartItemExtras>;
  readonly accessoryGroupsByItemId: ReadonlyMap<
    number,
    readonly PlainAccessoryGroup[]
  >;
};

export function useCheckoutScreen(
  catalogItems: readonly PlainShopItem[],
): CheckoutScreenState {
  const { form, update } = useCheckoutForm();
  const itemExtras = useMemo(
    () => buildItemExtrasMap(catalogItems),
    [catalogItems],
  );
  const accessoryGroupsByItemId = useMemo(
    () => buildAccessoryGroupsByItemId(catalogItems),
    [catalogItems],
  );

  return { form, update, itemExtras, accessoryGroupsByItemId };
}

function buildAccessoryGroupsByItemId(
  catalogItems: readonly PlainShopItem[],
): ReadonlyMap<number, readonly PlainAccessoryGroup[]> {
  const byItemId = new Map<number, readonly PlainAccessoryGroup[]>();

  for (const item of catalogItems) {
    byItemId.set(item.id, item.accessoryGroups);
  }

  return byItemId;
}
