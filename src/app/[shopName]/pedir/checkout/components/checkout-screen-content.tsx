"use client";

import type { CheckoutScreenContentProps } from "./checkout-screen-content-props";
import { CustomerDataCard } from "./customer-data-card";
import { DeliveryDetailsCard } from "./delivery-details-card";
import { DeliverySegmentedToggle } from "./delivery-toggle";
import {
  ADDRESS_ERROR_MESSAGE,
  NAME_ERROR_MESSAGE,
  PHONE_ERROR_MESSAGE,
} from "./field-error-messages";
import { OrderSection } from "./order-section";

export function CheckoutScreenContent(props: CheckoutScreenContentProps) {
  const {
    form,
    update,
    itemExtras,
    accessoryGroupsByItemId,
    onSelectAccessories,
    cart,
    shopName,
    shop,
    isDelivery,
    fieldError,
    showMissingAccessoryHints,
  } = props;

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
        accessoryGroupsByItemId={accessoryGroupsByItemId}
        onSelectAccessories={onSelectAccessories}
        showMissingAccessoryHints={showMissingAccessoryHints}
        shopName={shopName}
        notas={form.notas}
        onChange={update}
      />
    </>
  );
}
