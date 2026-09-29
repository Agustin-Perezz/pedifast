"use client";

import { Button } from "@/components/ui/button";

import { useCart } from "../hooks/useCart";
import type { PlainShop } from "../lib/serialize-shop";
import { submitCheckout } from "../lib/submit-checkout";
import { CheckoutSummary } from "./checkout/checkout-summary";
import { CustomerFields } from "./checkout/customer-fields";
import { DeliverySection } from "./checkout/delivery-section";
import { PaymentMethodSelector } from "./checkout/payment-method-selector";
import { useCheckoutForm } from "./checkout/use-checkout-form";

type CheckoutFormStepProps = {
  readonly shop: PlainShop;
};

export function CheckoutFormStep({ shop }: CheckoutFormStepProps) {
  const cart = useCart();
  const { form, update, error, submitting, setError, setSubmitting } =
    useCheckoutForm();

  return (
    <form
      className="space-y-4 py-4"
      data-testid="checkout-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitting(true);
        const result = await submitCheckout(shop, form, cart);
        setSubmitting(false);
        setError(result.error);
      }}
    >
      <CustomerFields
        nombre={form.nombre}
        telefono={form.telefono}
        notas={form.notas}
        onChange={update}
      />
      <DeliverySection shop={shop} values={form} onChange={update} />
      <PaymentMethodSelector
        value={form.paymentMethod}
        onChange={(paymentMethod) => update({ paymentMethod })}
      />
      <CheckoutSummary
        itemsTotal={cart.totalPrice}
        deliveryCost={form.deliveryCost}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
      <SubmitButton submitting={submitting} />
    </form>
  );
}

function SubmitButton({ submitting }: { readonly submitting: boolean }) {
  return (
    <Button
      type="submit"
      className="w-full rounded-lg py-3 font-semibold"
      data-testid="checkout-submit"
      disabled={submitting}
    >
      {submitting ? "Enviando..." : "Confirmar pedido"}
    </Button>
  );
}
