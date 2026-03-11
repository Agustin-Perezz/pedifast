export const AccessorySelectionMode = {
  single: 'single',
  multi: 'multi'
} as const;

export type AccessorySelectionMode =
  (typeof AccessorySelectionMode)[keyof typeof AccessorySelectionMode];

export interface AccessoryOption {
  id: number;
  name: string;
  priceDelta: number;
}

export interface AccessoryGroup {
  id: number;
  name: string;
  selectionMode: AccessorySelectionMode;
  isRequired: boolean;
  options: AccessoryOption[];
}

export interface SelectedAccessory {
  groupId: number;
  groupName: string;
  optionId: number;
  optionName: string;
  priceDelta: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: ShopItemCategory;
  description?: string;
  accessoryGroups?: AccessoryGroup[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedAccessories: SelectedAccessory[];
}

export interface OrderSummary {
  id: string;
  items: CartItem[];
  total: number;
  nombre: string;
  notas?: string;
  createdAt: string;
}

export const ShopItemCategory = {
  pizzas: 'pizzas',
  hamburguesas: 'hamburguesas',
  empanadas: 'empanadas',
  sandwiches: 'sandwiches',
  ensaladas: 'ensaladas',
  papas: 'papas',
  milanesas: 'milanesas',
  bebidas: 'bebidas'
} as const;

export type ShopItemCategory =
  (typeof ShopItemCategory)[keyof typeof ShopItemCategory];

export const CATEGORY_LABELS: Record<ShopItemCategory, string> = {
  [ShopItemCategory.pizzas]: 'Pizzas',
  [ShopItemCategory.hamburguesas]: 'Hamburguesas',
  [ShopItemCategory.empanadas]: 'Empanadas',
  [ShopItemCategory.sandwiches]: 'Sándwiches',
  [ShopItemCategory.ensaladas]: 'Ensaladas',
  [ShopItemCategory.papas]: 'Papas',
  [ShopItemCategory.milanesas]: 'Milanesas',
  [ShopItemCategory.bebidas]: 'Bebidas'
};

export interface ShopItem {
  id: number;
  shop_id: number;
  name: string;
  price: number;
  category: ShopItemCategory;
  images: string[];
  description: string | null;
  created_at: string;
  updated_at: string;
}
