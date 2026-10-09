"use client";

import type { CheckoutFormState } from "../../components/checkout/use-checkout-form";
import type { PatchCheckoutForm } from "../hooks/use-checkout-screen";
import { PaymentSection } from "./PaymentSection";
import { TipSection } from "./TipSection";

export type PaymentAndTipProps = {
  readonly paymentMethod: CheckoutFormState["paymentMethod"];
  readonly isPickup: boolean;
  readonly onChange: (patch: PatchCheckoutForm) => void;
};

export function PaymentAndTip({
  paymentMethod,
  isPickup,
  onChange,
}: PaymentAndTipProps) {
  return (
    <>
      <PaymentSection
        paymentMethod={paymentMethod}
        isPickup={isPickup}
        onChange={onChange}
      />
      <TipSection />
    </>
  );
}
