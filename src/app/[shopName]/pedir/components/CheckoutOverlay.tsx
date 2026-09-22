"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { AccessoryGroupWithOptions } from "@/domain/entities/accessory-group-with-options";
import { useCart } from "../hooks/useCart";
import { useCheckoutOpen } from "../hooks/useCheckoutOpen";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { PlainShop } from "../lib/serialize-shop";

import { AccessoryStep } from "./AccessoryStep";
import { CheckoutFormStep } from "./CheckoutFormStep";

type CheckoutOverlayProps = {
  readonly shop: PlainShop;
};

export function CheckoutOverlay({ shop }: CheckoutOverlayProps) {
  const { isOpen, closeCheckout } = useCheckoutOpen();
  const cart = useCart();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const accessoryGroupsByItemId = useAccessoryGroupsByItemId(cart.items);
  const [step, setStep] = useState<"accessories" | "checkout">(() =>
    cart.hasItemsWithAccessories(accessoryGroupsByItemId)
      ? "accessories"
      : "checkout",
  );

  const content = (
    <>
      {step === "accessories" ? (
        <AccessoryStep shop={shop} onContinue={() => setStep("checkout")} />
      ) : (
        <CheckoutFormStep shop={shop} />
      )}
    </>
  );

  return isDesktop ? (
    <Dialog open={isOpen} onOpenChange={closeCheckout}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirm order</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  ) : (
    <Sheet open={isOpen} onOpenChange={closeCheckout}>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Confirm order</SheetTitle>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  );
}

function useAccessoryGroupsByItemId(
  items: ReturnType<typeof useCart>["items"],
): ReadonlyMap<number, readonly AccessoryGroupWithOptions[]> {
  return useMemo(() => {
    const map = new Map<number, readonly AccessoryGroupWithOptions[]>();

    for (const item of items) {
      // Accessory group configuration arrives via catalog data in Phase 3 checkout wiring.
      map.set(item.product.id, []);
    }

    return map;
  }, [items]);
}
