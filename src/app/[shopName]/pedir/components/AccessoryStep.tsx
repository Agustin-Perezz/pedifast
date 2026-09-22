"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "../hooks/useCart";
import type { CartItem } from "../lib/cart-reducer";
import type { PlainShop } from "../lib/serialize-shop";

type AccessoryStepProps = {
  readonly shop: PlainShop;
  readonly onContinue: () => void;
};

export function AccessoryStep({ shop, onContinue }: AccessoryStepProps) {
  const cart = useCart();
  const itemsWithGroups = cart.items.filter(
    (cartItem) => cartItem.quantity > 0,
  );

  return (
    <div className="space-y-6 py-4">
      <p className="text-sm text-zinc-500">
        Customize your order for {shop.displayName ?? shop.shopName}
      </p>
      {itemsWithGroups.map((cartItem) => (
        <CartItemAccessories key={cartItem.product.id} cartItem={cartItem} />
      ))}
      <ContinueButton onContinue={onContinue} />
    </div>
  );
}

type CartItemAccessoriesProps = {
  readonly cartItem: CartItem;
};

function CartItemAccessories({ cartItem }: CartItemAccessoriesProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">{cartItem.product.name}</h3>
      <p className="text-xs text-zinc-400">Quantity: {cartItem.quantity}</p>
    </div>
  );
}

type ContinueButtonProps = {
  readonly onContinue: () => void;
};

function ContinueButton({ onContinue }: ContinueButtonProps) {
  return (
    <Button type="button" className="w-full" onClick={onContinue}>
      Continue
    </Button>
  );
}
