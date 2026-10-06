"use client";

import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import { PaymentMethod } from "@/domain/entities/payment-method.enum";
import { CheckoutDock } from "./checkout-dock";
import { CheckoutHeader } from "./checkout-header";
import type { CheckoutScreenBodyProps } from "./checkout-screen-body-props";
import { CheckoutScreenContent } from "./checkout-screen-content";
import { CostBreakdown } from "./cost-breakdown";
import { dockTotal } from "./dock-total";
import { ErrorText } from "./error-text";
import { PaymentAndTip } from "./payment-and-tip";

export function CheckoutScreenBody(props: CheckoutScreenBodyProps) {
  const {
    form,
    update,
    itemExtras,
    accessoryGroupsByItemId,
    onSelectAccessories,
    cart,
    shop,
    shopName,
    menuHref,
    submission,
    onSubmit,
  } = props;
  const isDelivery = form.deliveryMethod === DeliveryMethod.Delivery;

  return (
    <form
      className="min-h-screen bg-background"
      data-testid="checkout-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <CheckoutHeader shop={shop} shopName={shopName} backHref={menuHref} />
      <main className="px-5 pt-16 pb-40">
        <CheckoutScreenContent
          form={form}
          update={update}
          itemExtras={itemExtras}
          accessoryGroupsByItemId={accessoryGroupsByItemId}
          onSelectAccessories={onSelectAccessories}
          cart={cart}
          shopName={shopName}
          shop={shop}
          isDelivery={isDelivery}
          fieldError={submission.fieldError}
          showMissingAccessoryHints={submission.missingRequiredGroups}
        />
        <PaymentAndTip
          paymentMethod={form.paymentMethod}
          isPickup={!isDelivery}
          onChange={update}
        />
        <CostBreakdown
          totalItems={cart.totalItems}
          itemsTotal={cart.totalPrice}
          deliveryCost={form.deliveryCost}
          showShipping={isDelivery}
        />
        <ErrorText message={submission.error} />
      </main>
      <CheckoutDock
        total={dockTotal(cart.totalPrice, form)}
        payingWithMercadoPago={form.paymentMethod === PaymentMethod.MercadoPago}
        submitting={submission.submitting}
        onSubmit={onSubmit}
      />
    </form>
  );
}
