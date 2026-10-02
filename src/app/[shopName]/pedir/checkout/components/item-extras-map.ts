import type { PlainShopItem } from "../../lib/serialize-catalog";

export type CartItemExtras = {
  readonly image: string | null;
  readonly description: string | null;
};

export type CartItemExtrasMap = ReadonlyMap<number, CartItemExtras>;

export type CheckoutItemExtras = {
  readonly extrasById: CartItemExtrasMap;
};

export function buildItemExtrasMap(
  items: readonly PlainShopItem[],
): CartItemExtrasMap {
  const extrasById = new Map<number, CartItemExtras>();

  for (const item of items) {
    extrasById.set(item.id, {
      image: item.images[0] ?? null,
      description: item.description,
    });
  }

  return extrasById;
}
