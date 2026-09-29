"use client";

import { useMemo, useState } from "react";
import { useCart } from "../context/use-cart";
import { useCheckoutOpen } from "../hooks/useCheckoutOpen";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { PlainShopItem } from "../lib/serialize-catalog";
import type { PlainShop } from "../lib/serialize-shop";
import { AccessoryStep } from "./AccessoryStep";
import { CheckoutFormStep } from "./CheckoutFormStep";
import { CheckoutDesktopShell } from "./checkout/checkout-desktop-shell";
import { CheckoutMobileShell } from "./checkout/checkout-mobile-shell";

const DESKTOP_QUERY = "(min-width: 768px)";

type CheckoutOverlayProps = {
  readonly shop: PlainShop;
  readonly items: readonly PlainShopItem[];
};

export function CheckoutOverlay({ shop, items }: CheckoutOverlayProps) {
  const { isOpen, closeCheckout } = useCheckoutOpen();
  const cart = useCart();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const groupsByItemId = useGroupsByItemId(items);
  const [step, setStep] = useState<"accessories" | "checkout">(() =>
    cart.hasItemsWithAccessories(groupsByItemId) ? "accessories" : "checkout",
  );

  const content =
    step === "accessories" ? (
      <AccessoryStep items={items} onContinue={() => setStep("checkout")} />
    ) : (
      <CheckoutFormStep shop={shop} />
    );

  return isDesktop ? (
    <CheckoutDesktopShell open={isOpen} onOpenChange={closeCheckout}>
      {content}
    </CheckoutDesktopShell>
  ) : (
    <CheckoutMobileShell open={isOpen} onOpenChange={closeCheckout}>
      {content}
    </CheckoutMobileShell>
  );
}

function useGroupsByItemId(items: readonly PlainShopItem[]) {
  return useMemo(() => {
    const map = new Map<
      number,
      readonly (typeof items)[number]["accessoryGroups"][number][]
    >();

    for (const item of items) {
      if (item.accessoryGroups.length > 0) {
        map.set(item.id, item.accessoryGroups);
      }
    }

    return map;
  }, [items]);
}
