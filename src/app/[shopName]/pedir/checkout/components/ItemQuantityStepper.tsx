"use client";

import type { CartItem } from "../../lib/cart-reducer";
import { StepperButton } from "./StepperButton";

export type ItemQuantityStepperProps = {
  readonly item: CartItem;
  readonly onAddItem: (item: CartItem) => void;
  readonly onRemoveItem: (item: CartItem) => void;
};

export function ItemQuantityStepper({
  item,
  onAddItem,
  onRemoveItem,
}: ItemQuantityStepperProps) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-surface-container px-2 py-0.5">
      <StepperButton
        label="Quitar cantidad"
        testId={`remove-from-cart-${item.product.id}`}
        onClick={() => onRemoveItem(item)}
      >
        −
      </StepperButton>
      <span
        className="px-1 text-[12px] font-bold text-foreground"
        data-testid={`cart-quantity-${item.product.id}`}
      >
        {item.quantity}
      </span>
      <StepperButton
        label="Añadir cantidad"
        testId={`add-to-cart-${item.product.id}`}
        onClick={() => onAddItem(item)}
      >
        +
      </StepperButton>
    </div>
  );
}
