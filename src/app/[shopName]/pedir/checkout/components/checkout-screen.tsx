"use client";

import { useCart } from "../../context/use-cart";
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
  const { error, submitting, setError, setSubmitting } =
    useCheckoutSubmission();

  const menuHref = `/${shopName}/${MENU_ROUTE_SEGMENT}`;
  const submission = { error, submitting, setError, setSubmitting };
  const screenProps = {
    form,
    update,
    itemExtras,
    cart,
    shop,
    shopName,
    menuHref,
    submission,
  };

  function handleSubmit(): void {
    void runSubmit();
  }

  async function runSubmit(): Promise<void> {
    setSubmitting(true);
    const result = await submitCheckout(shop, form, cart);
    setSubmitting(false);
    setError(result.error);
  }

  return <CheckoutScreenBody {...screenProps} onSubmit={handleSubmit} />;
}
