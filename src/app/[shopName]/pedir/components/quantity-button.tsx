"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type QuantityButtonProps = {
  readonly testId: string;
  readonly label: string;
  readonly onClick: () => void;
  readonly children: React.ReactNode;
};

export function QuantityButton({
  testId,
  label,
  onClick,
  children,
}: QuantityButtonProps) {
  return (
    <Button
      type="button"
      size="icon-sm"
      data-testid={testId}
      onClick={onClick}
      aria-label={label}
    >
      {children}
    </Button>
  );
}

export function MinusButton(props: Omit<QuantityButtonProps, "children">) {
  return (
    <QuantityButton {...props}>
      <Minus className="size-4" />
    </QuantityButton>
  );
}

export function PlusButton(props: Omit<QuantityButtonProps, "children">) {
  return (
    <QuantityButton {...props}>
      <Plus className="size-4" />
    </QuantityButton>
  );
}
