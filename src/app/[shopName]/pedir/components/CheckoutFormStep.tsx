"use client";

import { useCart } from "../hooks/useCart";
import type { PlainShop } from "../lib/serialize-shop";

type CheckoutFormStepProps = {
  readonly shop: PlainShop;
};

export function CheckoutFormStep({ shop }: CheckoutFormStepProps) {
  const cart = useCart();

  return (
    <div className="space-y-4 py-4">
      <p className="text-sm text-zinc-500">
        Checkout for {shop.displayName ?? shop.shopName}
      </p>
      <p className="text-sm">Total: {formatPrice(cart.totalPrice)}</p>
    </div>
  );
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`;
}
