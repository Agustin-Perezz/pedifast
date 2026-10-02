"use client";

import type { CheckoutFormState } from "../../components/checkout/use-checkout-form";
import type { CartContextValue } from "../../context/cart-context";
import type { CheckoutFieldError } from "../../lib/submit-checkout";
import type { PatchCheckoutForm } from "../hooks/use-checkout-screen";
import type { CheckoutScreenContentShop } from "./checkout-screen-content-shop";
import { CustomerDataCard } from "./customer-data-card";
import { DeliveryDetailsCard } from "./delivery-details-card";
import { DeliverySegmentedToggle } from "./delivery-toggle";
import type { CartItemExtras } from "./item-extras-map";
import { OrderSection } from "./order-section";

export type CheckoutScreenContentProps = {
  readonly form: CheckoutFormState;
  readonly update: (patch: PatchCheckoutForm) => void;
  readonly itemExtras: ReadonlyMap<number, CartItemExtras>;
  readonly cart: CartContextValue;
  readonly shopName: string;
  readonly shop: CheckoutScreenContentShop;
  readonly isDelivery: boolean;
  readonly fieldError: CheckoutFieldError | null;
};

export function CheckoutScreenContent({
  form,
  update,
  itemExtras,
  cart,
  shopName,
  shop,
  isDelivery,
  fieldError,
}: CheckoutScreenContentProps) {
  return (
    <>
      <DeliverySegmentedToggle
        value={form.deliveryMethod}
        onChange={(deliveryMethod) => update({ deliveryMethod })}
      />
      {isDelivery && (
        <DeliveryDetailsCard
          shop={shop}
          address={form.address}
          onAddressChange={(address) => update({ address })}
          onCostChange={(deliveryCost) => update({ deliveryCost })}
          addressError={fieldError === "address" ? ADDRESS_ERROR_MESSAGE : null}
        />
      )}
      <CustomerDataCard
        nombre={form.nombre}
        telefono={form.telefono}
        onChange={update}
        nameError={fieldError === "nombre" ? NAME_ERROR_MESSAGE : null}
        phoneError={fieldError === "telefono" ? PHONE_ERROR_MESSAGE : null}
      />
      <OrderSection
        cart={cart}
        itemExtras={itemExtras}
        shopName={shopName}
        notas={form.notas}
        onChange={update}
      />
    </>
  );
}

const ADDRESS_ERROR_MESSAGE = "Ingresa la dirección de envío";
const NAME_ERROR_MESSAGE = "Ingresa tu nombre";
const PHONE_ERROR_MESSAGE = "Ingresa tu teléfono";
