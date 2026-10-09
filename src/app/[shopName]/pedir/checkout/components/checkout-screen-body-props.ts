"use client";

import type { CartContextValue } from "../../context/cart-context";
import type { CheckoutFormState } from "../../hooks/useCheckoutForm";
import type {
  PlainAccessoryGroup,
  PlainAccessoryOption,
} from "../../lib/serialize-catalog";
import type { PlainShop } from "../../lib/serialize-shop";
import type { PatchCheckoutForm } from "../hooks/useCheckoutScreen";
import type { CheckoutSubmissionState } from "../hooks/useCheckoutSubmission";
import type { CartItemExtras } from "./item-extras-map";

export type CheckoutScreenBodyProps = {
  readonly form: CheckoutFormState;
  readonly update: (patch: PatchCheckoutForm) => void;
  readonly itemExtras: ReadonlyMap<number, CartItemExtras>;
  readonly accessoryGroupsByItemId: ReadonlyMap<
    number,
    readonly PlainAccessoryGroup[]
  >;
  readonly onSelectAccessories: (
    itemId: number,
    group: PlainAccessoryGroup,
    selectedOptions: readonly PlainAccessoryOption[],
  ) => void;
  readonly cart: CartContextValue;
  readonly shop: PlainShop;
  readonly shopName: string;
  readonly menuHref: string;
  readonly submission: CheckoutSubmissionState;
  readonly onSubmit: () => void;
};
