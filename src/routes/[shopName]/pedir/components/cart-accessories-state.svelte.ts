import { cart } from '$lib/cart.svelte';
import type {
  AccessoryGroup,
  CartItem,
  SelectedAccessory
} from '$lib/types/product';

type GroupSelections = Record<number, number[]>;
type AllSelections = Record<string, GroupSelections>;

function buildGroupSelections(item: CartItem): GroupSelections {
  const groups: GroupSelections = {};
  for (const group of item.product.accessoryGroups ?? []) {
    groups[group.id] = item.selectedAccessories
      .filter((a) => {
        return a.groupId === group.id;
      })
      .map((a) => {
        return a.optionId;
      });
  }
  return groups;
}

function buildAccessoriesForGroup(
  group: AccessoryGroup,
  optionIds: number[]
): SelectedAccessory[] {
  return optionIds
    .map((optionId) => {
      const option = group.options.find((o) => {
        return o.id === optionId;
      });
      if (!option) {
        return null;
      }
      return {
        groupId: group.id,
        groupName: group.name,
        optionId: option.id,
        optionName: option.name,
        priceDelta: option.priceDelta
      } satisfies SelectedAccessory;
    })
    .filter((a): a is SelectedAccessory => {
      return a !== null;
    });
}

export class CartAccessoriesState {
  selections: AllSelections = $state({});

  constructor() {
    $effect(() => {
      const initial: AllSelections = {};
      for (const item of cart.items) {
        if ((item.product.accessoryGroups?.length ?? 0) > 0) {
          initial[item.product.id] = buildGroupSelections(item);
        }
      }
      this.selections = initial;
    });
  }

  readonly itemsWithAccessories = $derived(
    cart.items.filter((item) => {
      return (item.product.accessoryGroups?.length ?? 0) > 0;
    })
  );

  readonly canContinue = $derived(() => {
    for (const item of this.itemsWithAccessories) {
      for (const group of item.product.accessoryGroups ?? []) {
        if (!group.isRequired) {
          continue;
        }
        const selected = this.selections[item.product.id]?.[group.id] ?? [];
        if (selected.length === 0) {
          return false;
        }
      }
    }
    return true;
  });

  selectOptions(productId: string, groupId: number, optionIds: number[]) {
    this.selections[productId] = {
      ...this.selections[productId],
      [groupId]: optionIds
    };
  }

  getSelectedOptionIds(productId: string, groupId: number): number[] {
    return this.selections[productId]?.[groupId] ?? [];
  }

  commitAndContinue(onContinue: () => void) {
    for (const item of this.itemsWithAccessories) {
      const itemSelections = this.selections[item.product.id] ?? {};
      const accessories = (item.product.accessoryGroups ?? []).flatMap(
        (group) => {
          return buildAccessoriesForGroup(
            group,
            itemSelections[group.id] ?? []
          );
        }
      );
      cart.setAccessories(item.product.id, accessories);
    }
    onContinue();
  }
}
