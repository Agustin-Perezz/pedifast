"use client";

import { ArrowRight, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format";

import { useCart } from "../context/use-cart";
import { useCheckoutOpen } from "../hooks/useCheckoutOpen";

type DockContentProps = {
  readonly totalItems: number;
  readonly totalPrice: number;
  readonly onOpenCheckout: () => void;
};

function DockIcon() {
  return (
    <span className="flex size-8 items-center justify-center rounded-full bg-surface-container-highest/20 text-inverse-on-surface">
      <ShoppingBag className="size-[18px]" />
    </span>
  );
}

function VerPedidoButton({ onClick }: { readonly onClick: () => void }) {
  return (
    <Button
      type="button"
      data-testid="confirm-order-button"
      className="rounded-lg bg-card px-4 py-2 text-sm font-bold text-inverse-surface hover:bg-card/90 active:scale-95"
      onClick={onClick}
    >
      Ver pedido
      <ArrowRight className="size-4" />
    </Button>
  );
}

function DockContent({
  totalItems,
  totalPrice,
  onOpenCheckout,
}: DockContentProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-inverse-surface p-3 text-inverse-on-surface shadow-md">
      <div className="flex items-center gap-3 pl-1">
        <DockIcon />
        <div className="flex min-w-0 flex-col">
          <span className="text-[11px] tracking-wider uppercase text-inverse-on-surface/70">
            Tu pedido
          </span>
          <span className="font-heading leading-none font-bold">
            {totalItems} {totalItems === 1 ? "producto" : "productos"} ·{" "}
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>
      <VerPedidoButton onClick={onOpenCheckout} />
    </div>
  );
}

export function CartBottomBar() {
  const cart = useCart();
  const { openCheckout } = useCheckoutOpen();

  if (cart.isEmpty) {
    return null;
  }

  return (
    <aside className="fixed inset-x-4 bottom-24 z-40 mx-auto max-w-lg md:inset-x-0 md:max-w-xl">
      <DockContent
        totalItems={cart.totalItems}
        totalPrice={cart.totalPrice}
        onOpenCheckout={openCheckout}
      />
    </aside>
  );
}
