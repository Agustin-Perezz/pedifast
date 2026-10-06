import type { CartItem } from "./cart-reducer";
import type { PlainAccessoryGroup } from "./serialize-catalog";

export type RequiredGroupMissingResult = {
  readonly itemId: number;
  readonly groupId: number;
};

/**
 * Finds the first cart item whose required accessory groups are not yet
 * selected, so the UI can scroll to it and block submission.
 */
export function findRequiredGroupMissingInCart(
  items: readonly CartItem[],
  accessoryGroupsByItemId: ReadonlyMap<number, readonly PlainAccessoryGroup[]>,
): RequiredGroupMissingResult | null {
  for (const item of items) {
    const groups = accessoryGroupsByItemId.get(item.product.id) ?? [];

    for (const group of groups) {
      if (
        group.isRequired &&
        !item.selectedAccessories.some(
          (accessory) => accessory.groupId === group.id,
        )
      ) {
        return { itemId: item.product.id, groupId: group.id };
      }
    }
  }

  return null;
}
