import { error } from '@sveltejs/kit';

import { supabase } from '$lib/server/supabase';
import type { Product } from '$lib/types/product';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const { shopName, productId } = params;

  const { data: shop } = await supabase
    .from('shops')
    .select('id')
    .eq('shop_name', shopName)
    .single();

  if (!shop) {
    error(404, 'Shop not found');
  }

  const { data: item } = await supabase
    .from('shop_items')
    .select('id, name, price, category, images, description')
    .eq('id', productId)
    .eq('shop_id', shop.id)
    .single();

  if (!item) {
    error(404, 'Product not found');
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
