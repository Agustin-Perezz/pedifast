import { error } from '@sveltejs/kit';

import { supabase } from '$lib/server/supabase';
import {
  ShopItemCategory,
  type Product,
  type ShopItem
} from '$lib/types/product';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const { shopName, productId } = params;

  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .select('id')
    .eq('shop_name', shopName)
    .single();

  if (shopError) error(500, 'Failed to load shop');
  if (!shop) error(404, 'Shop not found');

  const { data: item, error: itemError } = await supabase
    .from('shop_items')
    .select('id, name, price, category, images, description')
    .eq('id', productId)
    .eq('shop_id', shop.id)
    .single<
      Pick<
        ShopItem,
        'id' | 'name' | 'price' | 'category' | 'images' | 'description'
      >
    >();

  if (itemError) error(500, 'Failed to load product');
  if (!item) error(404, 'Product not found');

  const validCategories = Object.values(ShopItemCategory);
  if (!validCategories.includes(item.category)) {
    error(500, 'Invalid product category');
  }

  return {
    product: {
      id: String(item.id),
      name: item.name,
      price: Number(item.price),
      images: item.images,
      category: item.category,
      description: item.description ?? undefined
    } satisfies Product,
    shopName
  };
};
