"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useCart } from "../hooks/useCart";

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

  if (quantity === 0) {
    return (
      <Button
        type="button"
        variant="outline"
        data-testid={`add-to-cart-${id}`}
        onClick={() => cart.addItem({ id, name, price })}
      >
        {label}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        size="icon-sm"
        data-testid={`remove-from-cart-${id}`}
        onClick={() => cart.removeItem(id)}
        aria-label="Remove one"
      >
        <Minus className="size-4" />
      </Button>
      <span data-testid={`cart-quantity-${id}`}>{quantity}</span>
      <Button
        type="button"
        size="icon-sm"
        data-testid={`add-to-cart-${id}`}
        onClick={() => cart.addItem({ id, name, price })}
        aria-label="Add one"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}
