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
