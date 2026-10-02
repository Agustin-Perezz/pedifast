import type { CartItem, CartProduct } from "../../lib/cart-reducer";

export function cartProductFromItem(item: CartItem): CartProduct {
  return {
    id: item.product.id,
    name: item.product.name,
    price: item.product.price,
  };
}
