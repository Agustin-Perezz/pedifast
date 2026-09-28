"use client";

import { vibrateAddToCart } from "@/lib/utils/vibrate";

import { useCart } from "../hooks/useCart";
import { MinusButton, PlusButton } from "./quantity-button";

type AddToCartButtonProps = {
  readonly id: number;
  readonly name: string;
  readonly price: number;
  readonly label: string;
};

export function AddToCartButton({
  id,
  name,
  price,
  label,
}: AddToCartButtonProps) {
  const cart = useCart();
  const quantity = cart.getQuantity(id);
  const addItem = () => {
    cart.addItem({ id, name, price });
    vibrateAddToCart();
  };
  const removeItem = () => cart.removeItem(id);

  if (quantity === 0) {
    return (
      <button
        type="button"
        className="border-border rounded-lg border px-4 py-1.5 text-sm font-medium"
        data-testid={`add-to-cart-${id}`}
        onClick={addItem}
      >
        {label}
      </button>
    );
  }

  return (
    <div
      className="flex items-center gap-2"
      data-testid={`cart-controls-${id}`}
    >
      <MinusButton
        testId={`remove-from-cart-${id}`}
        label="Remove one"
        onClick={removeItem}
      />
      <span data-testid={`cart-quantity-${id}`}>{quantity}</span>
      <PlusButton
        testId={`add-to-cart-${id}`}
        label="Add one"
        onClick={addItem}
      />
    </div>
  );
}
