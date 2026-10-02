"use client";

import { useCart } from "../../context/use-cart";
import { scrollToCheckoutField } from "../../lib/scroll-to-checkout-field";
import type { PlainShopItem } from "../../lib/serialize-catalog";
import type { PlainShop } from "../../lib/serialize-shop";
import { submitCheckout } from "../../lib/submit-checkout";
import { useCheckoutScreen } from "../hooks/use-checkout-screen";
import { useCheckoutSubmission } from "../hooks/use-checkout-submission";
import { CheckoutScreenBody } from "./checkout-screen-body";

const MENU_ROUTE_SEGMENT = "pedir";

export type CheckoutScreenProps = {
  readonly shop: PlainShop;
  readonly shopName: string;
  readonly catalogItems: readonly PlainShopItem[];
};

export function CheckoutScreen({
  shop,
  shopName,
  catalogItems,
}: CheckoutScreenProps) {
  const cart = useCart();
  const { form, update, itemExtras } = useCheckoutScreen(catalogItems);
  const submission = useCheckoutSubmission();
  const menuHref = `/${shopName}/${MENU_ROUTE_SEGMENT}`;

  function handleSubmit(): void {
    void runSubmit();
  }

  async function runSubmit(): Promise<void> {
    submission.setSubmitting(true);
    const result = await submitCheckout(shop, form, cart);
    submission.setSubmitting(false);
    submission.setError(result.error);
    if (result.fieldError !== null) {
      submission.setFieldError(result.fieldError);
      scrollToCheckoutField(result.fieldError);
    }
  }

  return (
    <CheckoutScreenBody
      form={form}
      update={update}
      itemExtras={itemExtras}
      cart={cart}
      shop={shop}
      shopName={shopName}
      menuHref={menuHref}
      submission={submission}
      onSubmit={handleSubmit}
    />
  );
}
