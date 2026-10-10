"use client";

import { useRouter } from "next/navigation";

import { formatPrice } from "@/lib/utils/format";

import { useCart } from "../context/useCart";
import { DockIcon } from "./CartDockIcon";
import { VerPedidoButton } from "./VerPedidoButton";

const CHECKOUT_ROUTE_SEGMENT = "checkout";

type CartBottomBarProps = {
  readonly shopName: string;
};

export function CartBottomBar({ shopName }: CartBottomBarProps) {
  const cart = useCart();
  const router = useRouter();

  if (cart.isEmpty) {
    return null;
  }

  function openCheckout(): void {
    router.push(`/${shopName}/pedir/${CHECKOUT_ROUTE_SEGMENT}`);
  }

  return (
    <aside className="fixed inset-x-4 bottom-24 z-40 mx-auto max-w-lg md:inset-x-0 md:max-w-xl">
      <div className="flex items-center justify-between gap-3 rounded-xl bg-inverse-surface p-3 text-inverse-on-surface shadow-md">
        <div className="flex items-center gap-3 pl-1">
          <DockIcon />
          <div className="flex min-w-0 flex-col">
            <span className="text-[11px] uppercase tracking-wider text-inverse-on-surface/70">
              Tu pedido
            </span>
            <span className="font-heading leading-none font-bold">
              {cart.totalItems}{" "}
              {cart.totalItems === 1 ? "producto" : "productos"} ·{" "}
              {formatPrice(cart.totalPrice)}
            </span>
          </div>
        </div>
        <VerPedidoButton onClick={openCheckout} />
      </div>
    </aside>
  );
}
