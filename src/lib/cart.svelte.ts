import type { CartItem, Product } from '$lib/types/product';

class Cart {
  items: CartItem[] = $state([]);

  get totalItems() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice() {
    return this.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  get isEmpty() {
    return this.items.length === 0;
  }

  add(product: Product) {
    const existing = this.items.find((item) => item.product.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.items.push({ product, quantity: 1 });
    }
  }

  remove(productId: string) {
    const existing = this.items.find((item) => item.product.id === productId);
    if (!existing) return;
    if (existing.quantity > 1) {
      existing.quantity--;
    } else {
      this.items = this.items.filter((item) => item.product.id !== productId);
    }
  }

  getQuantity(productId: string): number {
    return (
      this.items.find((item) => item.product.id === productId)?.quantity ?? 0
    );
  }

  clear() {
    this.items = [];
  }
}

export const cart = new Cart();
