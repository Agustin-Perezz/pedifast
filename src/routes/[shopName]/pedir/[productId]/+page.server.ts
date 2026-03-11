import { error } from '@sveltejs/kit';

import { supabase } from '$lib/server/supabase';
import {
  ShopItemCategory,
  type AccessoryGroup,
  type AccessorySelectionMode,
  type Product
} from '$lib/types/product';
import type { PageServerLoad } from './$types';

interface RawAccessoryOption {
  id: number;
  name: string;
  price_delta: number;
  sort_order: number;
}

interface RawAccessoryGroup {
  id: number;
  name: string;
  selection_mode: string;
  is_required: boolean;
  sort_order: number;
  accessory_options: RawAccessoryOption[];
}

function mapAccessoryGroups(
  raw: RawAccessoryGroup[] | null
): AccessoryGroup[] | undefined {
  if (!raw || raw.length === 0) {
    return undefined;
  }
  return [...raw]
    .sort((a, b) => {
      return a.sort_order - b.sort_order;
    })
    .map((g) => ({
      id: g.id,
      name: g.name,
      selectionMode: g.selection_mode as AccessorySelectionMode,
      isRequired: g.is_required,
      options: [...g.accessory_options]
        .sort((a, b) => {
          return a.sort_order - b.sort_order;
        })
        .map((o) => ({
          id: o.id,
          name: o.name,
          priceDelta: Number(o.price_delta)
        }))
    }));
}

export const load: PageServerLoad = async ({ params, setHeaders }) => {
  const { shopName, productId } = params;

  setHeaders({
    'cache-control': 'public, max-age=30, stale-while-revalidate=60'
  });

  const [{ data: shop, error: shopError }, { data: item, error: itemError }] =
    await Promise.all([
      supabase.from('shops').select('id').eq('shop_name', shopName).single(),
      supabase
        .from('shop_items')
        .select(
          'id, name, price, category, images, description, shop_id, accessory_groups(id, name, selection_mode, is_required, sort_order, accessory_options(id, name, price_delta, sort_order))'
        )
        .eq('id', productId)
        .single()
    ]);

  if (shopError) error(500, 'Failed to load shop');
  if (!shop) error(404, 'Shop not found');
  if (itemError) error(500, 'Failed to load product');
  if (!item) error(404, 'Product not found');
  if (item.shop_id !== shop.id) error(404, 'Product not found');

  const validCategories = Object.values(ShopItemCategory);
  if (!validCategories.includes(item.category as ShopItemCategory)) {
    error(500, 'Invalid product category');
  }

  return {
    product: {
      id: String(item.id),
      name: item.name,
      price: Number(item.price),
      images: item.images as string[],
      category: item.category as ShopItemCategory,
      description: (item.description as string | null) ?? undefined,
      accessoryGroups: mapAccessoryGroups(
        (item as Record<string, unknown>).accessory_groups as
          | RawAccessoryGroup[]
          | null
      )
    } satisfies Product,
    shopName
  };
};
