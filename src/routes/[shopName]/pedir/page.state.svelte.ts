import {
  CATEGORY_LABELS,
  ShopItemCategory,
  type Product,
  type ShopItemCategory as ShopItemCategoryType
} from '$lib/types/product';
import type { PageData } from './$types';

const CATEGORY_EMOJIS = {
  [ShopItemCategory.hamburguesas]: '🍔',
  [ShopItemCategory.pizzas]: '🍕',
  [ShopItemCategory.empanadas]: '🥟',
  [ShopItemCategory.papas]: '🍟',
  [ShopItemCategory.milanesas]: '🥩',
  [ShopItemCategory.bebidas]: '🥤',
  [ShopItemCategory.sandwiches]: '🥪',
  [ShopItemCategory.ensaladas]: '🥗'
} satisfies Record<ShopItemCategoryType, string>;

const CATEGORY_ORDER: ShopItemCategoryType[] = [
  ShopItemCategory.hamburguesas,
  ShopItemCategory.pizzas,
  ShopItemCategory.empanadas,
  ShopItemCategory.papas,
  ShopItemCategory.milanesas,
  ShopItemCategory.bebidas,
  ShopItemCategory.sandwiches,
  ShopItemCategory.ensaladas
];

export interface GroupedCategory {
  key: ShopItemCategoryType;
  label: string;
  emoji: string;
  products: Product[];
}

export function createPedirState(data: PageData) {
  let checkoutOpen = $state(false);
  let activeCategory = $state<ShopItemCategoryType | null>(null);

  const groupedCategories = $derived(
    CATEGORY_ORDER.map((cat) => ({
      key: cat,
      label: CATEGORY_LABELS[cat],
      emoji: CATEGORY_EMOJIS[cat],
      products: data.products.filter((p) => {
        return p.category === cat;
      })
    })).filter((c) => {
      return c.products.length > 0;
    })
  );

  function scrollToCategory(key: ShopItemCategoryType): void {
    document
      .getElementById(key)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function observeSections(node: HTMLElement) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeCategory = entry.target.id as ShopItemCategoryType;
            break;
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    node.querySelectorAll('section[id]').forEach((s) => {
      observer.observe(s);
    });

    return {
      destroy: () => {
        observer.disconnect();
      }
    };
  }

  return {
    get checkoutOpen() {
      return checkoutOpen;
    },
    set checkoutOpen(val: boolean) {
      checkoutOpen = val;
    },
    get activeCategory() {
      return activeCategory;
    },
    get groupedCategories() {
      return groupedCategories;
    },
    scrollToCategory,
    observeSections
  };
}
