export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderSummary {
  id: string;
  items: CartItem[];
  total: number;
  nombre: string;
  notas?: string;
  createdAt: string;
}

export type ShopItemCategory =
  | 'comidas'
  | 'bebidas'
  | 'postres'
  | 'acompañamientos';

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
