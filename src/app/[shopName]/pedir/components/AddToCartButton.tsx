"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { vibrateAddToCart } from "@/lib/utils/vibrate";

import { useCart } from "../context/use-cart";
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
      <Button
        type="button"
        variant="secondary"
        className="rounded-full px-3.5 py-1.5 text-sm font-semibold active:scale-95"
        data-testid={`add-to-cart-${id}`}
        onClick={addItem}
      >
        <Plus className="size-3.5" />
        {label}
      </Button>
    );
  }

  return (
    <div
      className="flex items-center gap-2 rounded-full bg-surface-container-high px-2 py-1"
      data-testid={`cart-controls-${id}`}
    >
      <MinusButton
        testId={`remove-from-cart-${id}`}
        label="Quitar uno"
        onClick={removeItem}
      />
      <span
        className="px-1 text-sm font-bold text-foreground"
        data-testid={`cart-quantity-${id}`}
      >
        {quantity}
      </span>
      <PlusButton
        testId={`add-to-cart-${id}`}
        label="Agregar uno"
        onClick={addItem}
      />
    </div>
  );
}
