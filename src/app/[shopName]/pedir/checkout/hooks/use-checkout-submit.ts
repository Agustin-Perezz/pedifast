"use client";

import type { CheckoutFormState } from "../../components/checkout/use-checkout-form";
import type { CartContextValue } from "../../context/cart-context";
import { findRequiredGroupMissingInCart } from "../../lib/find-required-group-missing-in-cart";
import { scrollToCheckoutField } from "../../lib/scroll-to-checkout-field";
import type { PlainAccessoryGroup } from "../../lib/serialize-catalog";
import type { PlainShop } from "../../lib/serialize-shop";
import type { CheckoutFieldError } from "../../lib/submit-checkout";
import { submitCheckout } from "../../lib/submit-checkout";

export type AccessoryGroupsByItemId = ReadonlyMap<
  number,
  readonly PlainAccessoryGroup[]
>;

export type UseCheckoutSubmitArgs = {
  readonly shop: PlainShop;
  readonly form: CheckoutFormState;
  readonly cart: CartContextValue;
  readonly accessoryGroupsByItemId: AccessoryGroupsByItemId;
  readonly onMissingRequiredGroups: () => void;
  readonly onError: (error: string | null) => void;
  readonly onFieldError: (field: CheckoutFieldError) => void;
  readonly setSubmitting: (submitting: boolean) => void;
};

export function useCheckoutSubmit(args: UseCheckoutSubmitArgs) {
  return async function submit(): Promise<void> {
    const missing = findRequiredGroupMissingInCart(
      args.cart.items,
      args.accessoryGroupsByItemId,
    );
    if (missing !== null) {
      args.onMissingRequiredGroups();
      document
        .getElementById(`item-accessories-${missing.itemId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    args.setSubmitting(true);
    const result = await submitCheckout(args.shop, args.form, args.cart);
    args.setSubmitting(false);
    args.onError(result.error);
    if (result.fieldError !== null) {
      args.onFieldError(result.fieldError);
      scrollToCheckoutField(result.fieldError);
    }
  };
}
