"use client";

import { ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useCart } from "../hooks/useCart";
import { useCheckoutOpen } from "../hooks/useCheckoutOpen";

export function CartBottomBar() {
  const cart = useCart();
  const { openCheckout } = useCheckoutOpen();

  if (cart.isEmpty) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:max-w-3xl lg:max-w-5xl">
      <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-zinc-200">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-900">
            <ClipboardList className="size-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500">
              {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"}
            </span>
            <span className="font-mono text-lg font-semibold text-zinc-950">
              {formatPrice(cart.totalPrice)}
            </span>
          </div>
        </div>
        <Button
          type="button"
          data-testid="confirm-order-button"
          className="min-h-[44px] min-w-[44px] rounded-lg px-6"
          onClick={openCheckout}
        >
          Confirm order
        </Button>
      </div>
    </div>
  );
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`;
}
