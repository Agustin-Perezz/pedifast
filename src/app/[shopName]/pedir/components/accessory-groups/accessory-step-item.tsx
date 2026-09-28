"use client";

import { useCart } from "../../hooks/useCart";
import type { PlainShopItem } from "../../lib/serialize-catalog";
import { AccessoryGroupSection } from "../AccessoryGroupSection";

type AccessoryStepItemProps = {
  readonly item: PlainShopItem;
};

export function AccessoryStepItem({ item }: AccessoryStepItemProps) {
  const cart = useCart();

  return (
    <div className="space-y-4">
      <h3
        className="font-medium"
        data-testid={`accessory-step-item-${item.id}`}
      >
        {item.name}
      </h3>
      {item.accessoryGroups.map((group) => (
        <AccessoryGroupSection
          key={group.id}
          group={group}
          selectedOptions={getSelectedIds(cart, item.id, group.id)}
          onChange={(selectedOptions) =>
            cart.setAccessories(item.id, group, selectedOptions)
          }
        />
      ))}
    </div>
  );
}

function getSelectedIds(
  cart: ReturnType<typeof useCart>,
  itemId: number,
  groupId: number,
): readonly number[] {
  const cartItem = cart.items.find(
    (candidate) => candidate.product.id === itemId,
  );

  return (
    cartItem?.selectedAccessories
      .filter((accessory) => accessory.groupId === groupId)
      .map((accessory) => accessory.optionId) ?? []
  );
}
