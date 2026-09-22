import type { CatalogItem } from "@/application/use-cases/get-shop-catalog/get-shop-catalog.response.dto";

export type PlainShopItem = {
  readonly id: number;
  readonly name: string;
  readonly price: number;
  readonly category: string;
  readonly images: readonly string[];
  readonly description: string | null;
  readonly hasAccessoryGroups: boolean;
};

export type PlainCategoryGroup = {
  readonly key: string;
  readonly label: string;
  readonly emoji: string;
  readonly products: readonly PlainShopItem[];
};

type SerializeItemsInput = {
  readonly items: readonly CatalogItem[];
  readonly categoryLabels: Readonly<Record<string, string>>;
  readonly categoryEmojis: Readonly<Record<string, string>>;
  readonly categoryOrder: readonly string[];
};

export function serializeCategoryGroups({
  items,
  categoryLabels,
  categoryEmojis,
  categoryOrder,
}: SerializeItemsInput): readonly PlainCategoryGroup[] {
  const byCategory = new Map<string, PlainShopItem[]>();

  for (const catalogItem of items) {
    const item = catalogItem.item;
    const plain: PlainShopItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      images: item.images,
      description: item.description,
      hasAccessoryGroups: catalogItem.accessoryGroups.length > 0,
    };
    const list = byCategory.get(item.category) ?? [];
    list.push(plain);
    byCategory.set(item.category, list);
  }

  return categoryOrder
    .filter((key) => byCategory.has(key))
    .map((key) => ({
      key,
      label: categoryLabels[key],
      emoji: categoryEmojis[key],
      products: byCategory.get(key) ?? [],
    }));
}
