"use client";

import { Button } from "@/components/ui/button";

export type StepperButtonProps = {
  readonly label: string;
  readonly testId: string;
  readonly onClick: () => void;
  readonly children: React.ReactNode;
};

export function StepperButton({
  label,
  testId,
  onClick,
  children,
}: StepperButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={label}
      data-testid={testId}
      onClick={onClick}
      className="flex size-5 items-center justify-center rounded-full text-[14px] font-bold text-foreground hover:text-primary hover:bg-transparent"
    >
      {children}
    </Button>
  );
}
