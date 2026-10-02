import { Bike, Store } from "lucide-react";

import { Button } from "@/components/ui/button";

import { DELIVERY_LABEL } from "../../lib/checkout-labels";

export type ToggleTabProps = {
  readonly active: boolean;
  readonly label: string;
  readonly testId: string;
  readonly onSelect: () => void;
};

export function ToggleTab({ active, label, testId, onSelect }: ToggleTabProps) {
  const Icon = label === DELIVERY_LABEL ? Bike : Store;
  const activeClass = active
    ? "bg-foreground text-background shadow-sm"
    : "text-muted-foreground hover:text-foreground";

  return (
    <Button
      type="button"
      data-testid={testId}
      aria-pressed={active}
      onClick={onSelect}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium ${activeClass}`}
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      {label}
    </Button>
  );
}
