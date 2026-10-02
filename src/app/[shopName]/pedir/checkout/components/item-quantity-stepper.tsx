"use client";

import { Button } from "@/components/ui/button";

import type { CartItem } from "../../lib/cart-reducer";

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

type StepperButtonProps = {
  readonly label: string;
  readonly testId: string;
  readonly onClick: () => void;
  readonly children: React.ReactNode;
};

function StepperButton({
  label,
  testId,
  onClick,
  children,
}: StepperButtonProps) {
  return (
    <Button
      type="button"
      aria-label={label}
      data-testid={testId}
      onClick={onClick}
      className="flex size-5 items-center justify-center rounded-full text-[14px] font-bold text-foreground hover:text-primary"
    >
      {children}
    </Button>
  );
}
