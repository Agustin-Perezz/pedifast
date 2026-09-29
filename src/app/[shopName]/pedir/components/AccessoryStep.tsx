"use client";

import { Button } from "@/components/ui/button";

import { useCart } from "../context/use-cart";
import type { PlainShopItem } from "../lib/serialize-catalog";
import { AccessoryStepItem } from "./accessory-groups/accessory-step-item";

type AccessoryStepProps = {
  readonly items: readonly PlainShopItem[];
  readonly onContinue: () => void;
};

export function AccessoryStep({ items, onContinue }: AccessoryStepProps) {
  const cart = useCart();
  const itemsWithGroups = items.filter(
    (item) => item.accessoryGroups.length > 0 && cart.getQuantity(item.id) > 0,
  );

  return (
    <div className="space-y-6 py-4">
      {itemsWithGroups.map((item) => (
        <AccessoryStepItem key={item.id} item={item} />
      ))}
      <ContinueButton items={itemsWithGroups} onContinue={onContinue} />
    </div>
  );
}

type ContinueButtonProps = {
  readonly items: readonly PlainShopItem[];
  readonly onContinue: () => void;
};

function ContinueButton({ items, onContinue }: ContinueButtonProps) {
  const cart = useCart();
  const disabled = items.some((item) =>
    cart.hasMissingRequiredGroups(item.id, item.accessoryGroups),
  );

  return (
    <Button
      type="button"
      className="w-full"
      data-testid="accessories-continue"
      onClick={onContinue}
      disabled={disabled}
    >
      Continue
    </Button>
  );
}
