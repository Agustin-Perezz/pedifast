"use client";

import { useCart } from "../../context/use-cart";
import type {
  PlainAccessoryGroup,
  PlainAccessoryOption,
  PlainShopItem,
} from "../../lib/serialize-catalog";
import type { PlainShop } from "../../lib/serialize-shop";
import { updateWithFieldErrorClearing } from "../../lib/update-with-field-error-clearing";
import { useCheckoutScreen } from "../hooks/use-checkout-screen";
import { useCheckoutSubmission } from "../hooks/use-checkout-submission";
import { useCheckoutSubmit } from "../hooks/use-checkout-submit";
import { CheckoutScreenBody } from "./checkout-screen-body";

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
  const { form, update, itemExtras, accessoryGroupsByItemId } =
    useCheckoutScreen(catalogItems);
  const submission = useCheckoutSubmission();
  const updateWithClearing = updateWithFieldErrorClearing(update, submission);

  const submit = useCheckoutSubmit({
    shop,
    form,
    cart,
    accessoryGroupsByItemId,
    onMissingRequiredGroups: () => submission.setMissingRequiredGroups(true),
    onError: submission.setError,
    onFieldError: submission.setFieldError,
    setSubmitting: submission.setSubmitting,
  });

  function handleSelectAccessories(
    itemId: number,
    group: PlainAccessoryGroup,
    selectedOptions: readonly PlainAccessoryOption[],
  ): void {
    cart.setAccessories(itemId, group, selectedOptions);
    submission.setMissingRequiredGroups(false);
  }

  return (
    <CheckoutScreenBody
      form={form}
      update={updateWithClearing}
      itemExtras={itemExtras}
      accessoryGroupsByItemId={accessoryGroupsByItemId}
      onSelectAccessories={handleSelectAccessories}
      cart={cart}
      shop={shop}
      shopName={shopName}
      menuHref={`/${shopName}/pedir`}
      submission={submission}
      onSubmit={() => void submit()}
    />
  );
}
