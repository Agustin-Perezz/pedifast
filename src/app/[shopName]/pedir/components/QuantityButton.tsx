"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type QuantityButtonProps = {
  readonly testId: string;
  readonly label: string;
  readonly onClick: () => void;
  readonly dark: boolean;
  readonly children: React.ReactNode;
};

type NamedQuantityButtonProps = Omit<QuantityButtonProps, "children" | "dark">;

export function QuantityButton({
  testId,
  label,
  onClick,
  dark,
  children,
}: QuantityButtonProps) {
  return (
    <Button
      type="button"
      size="icon-sm"
      className={
        dark
          ? "size-6 rounded-full bg-inverse-surface text-inverse-on-surface"
          : "size-6 rounded-full bg-card text-foreground"
      }
      data-testid={testId}
      onClick={onClick}
      aria-label={label}
    >
      {children}
    </Button>
  );
}

export function MinusButton(props: NamedQuantityButtonProps) {
  return (
    <QuantityButton {...props} dark={false}>
      <Minus className="size-3.5" />
    </QuantityButton>
  );
}

export function PlusButton(props: NamedQuantityButtonProps) {
  return (
    <QuantityButton {...props} dark={true}>
      <Plus className="size-3.5" />
    </QuantityButton>
  );
}
