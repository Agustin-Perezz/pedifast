import { ShopItemCategory } from "@/domain/entities/shop-item-category.enum";

export const CATEGORY_LABELS: Record<ShopItemCategory, string> = {
  [ShopItemCategory.Hamburguesas]: "Hamburguesas",
  [ShopItemCategory.Pizzas]: "Pizzas",
  [ShopItemCategory.Empanadas]: "Empanadas",
  [ShopItemCategory.Papas]: "Papas",
  [ShopItemCategory.Milanesas]: "Milanesas",
  [ShopItemCategory.Bebidas]: "Bebidas",
  [ShopItemCategory.Sandwiches]: "Sándwiches",
  [ShopItemCategory.Ensaladas]: "Ensaladas",
};

export const CATEGORY_ORDER: readonly ShopItemCategory[] = [
  ShopItemCategory.Hamburguesas,
  ShopItemCategory.Pizzas,
  ShopItemCategory.Empanadas,
  ShopItemCategory.Papas,
  ShopItemCategory.Milanesas,
  ShopItemCategory.Bebidas,
  ShopItemCategory.Sandwiches,
  ShopItemCategory.Ensaladas,
];

export const CATEGORY_EMOJIS: Record<ShopItemCategory, string> = {
  [ShopItemCategory.Hamburguesas]: "🍔",
  [ShopItemCategory.Pizzas]: "🍕",
  [ShopItemCategory.Empanadas]: "🥟",
  [ShopItemCategory.Papas]: "🍟",
  [ShopItemCategory.Milanesas]: "🥩",
  [ShopItemCategory.Bebidas]: "🥤",
  [ShopItemCategory.Sandwiches]: "🥪",
  [ShopItemCategory.Ensaladas]: "🥗",
};
