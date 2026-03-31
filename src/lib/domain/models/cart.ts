import type { Product } from './product';

export interface SelectedAccessory {
  groupId: number;
  groupName: string;
  optionId: number;
  optionName: string;
  priceDelta: number;
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
