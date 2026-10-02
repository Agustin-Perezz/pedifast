"use client";

import type { CheckoutFormState } from "../../components/checkout/use-checkout-form";
import type { CartContextValue } from "../../context/cart-context";
import type { PlainShop } from "../../lib/serialize-shop";
import type { PatchCheckoutForm } from "../hooks/use-checkout-screen";
import type { CheckoutSubmissionState } from "../hooks/use-checkout-submission";
import type { CartItemExtras } from "./item-extras-map";

export type CheckoutScreenBodyProps = {
  readonly form: CheckoutFormState;
  readonly update: (patch: PatchCheckoutForm) => void;
  readonly itemExtras: ReadonlyMap<number, CartItemExtras>;
  readonly cart: CartContextValue;
  readonly shop: PlainShop;
  readonly shopName: string;
  readonly menuHref: string;
  readonly submission: CheckoutSubmissionState;
  readonly onSubmit: () => void;
};
