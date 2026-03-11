import type { CartItem, Product, SelectedAccessory } from '$lib/types/product';

class Cart {
  items: CartItem[] = $state([]);

  get totalItems() {
    return this.items.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);
  }

  get totalPrice() {
    return this.items.reduce((sum, item) => {
      return sum + this.getItemUnitPrice(item) * item.quantity;
    }, 0);
  }

  get isEmpty() {
    return this.items.length === 0;
  }

  get hasItemsWithAccessories(): boolean {
    return this.items.some((item) => {
      return (item.product.accessoryGroups?.length ?? 0) > 0;
    });
  }

  getItemUnitPrice(item: CartItem): number {
    const accessoryTotal = item.selectedAccessories.reduce((sum, acc) => {
      return sum + acc.priceDelta;
    }, 0);
    return item.product.price + accessoryTotal;
  }

  add(product: Product) {
    const existing = this.items.find((item) => {
      return item.product.id === product.id;
    });
    if (existing) {
      existing.quantity++;
    } else {
      this.items.push({ product, quantity: 1, selectedAccessories: [] });
    }
  }

  remove(productId: string) {
    const existing = this.items.find((item) => {
      return item.product.id === productId;
    });
    if (!existing) return;
    if (existing.quantity > 1) {
      existing.quantity--;
    } else {
      this.items = this.items.filter((item) => {
        return item.product.id !== productId;
      });
    }
  }

  setAccessories(productId: string, selectedAccessories: SelectedAccessory[]) {
    const existing = this.items.find((item) => {
      return item.product.id === productId;
    });
    if (existing) {
      existing.selectedAccessories = selectedAccessories;
    }
  }

  getQuantity(productId: string): number {
    return (
      this.items.find((item) => {
        return item.product.id === productId;
      })?.quantity ?? 0
    );
  }

  clear() {
    this.items = [];
  }
}

export const cart = new Cart();
