import { error } from '@sveltejs/kit';

import { supabase } from '$lib/server/supabase';
import type { Product } from '$lib/types/product';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const { shopName } = params;

  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .select('id, address, delivery_price, whatsapp_phone')
    .eq('shop_name', shopName)
    .single();

  if (shopError || !shop) {
    error(404, `Shop "${shopName}" not found`);
  }

  const { data: items, error: itemsError } = await supabase
    .from('shop_items')
    .select('id, name, price, category, images, description')
    .eq('shop_id', shop.id)
    .order('id');

  if (itemsError) {
    error(500, 'Failed to load shop items');
  }

  const products: Product[] = (items ?? []).map((item) => ({
    id: String(item.id),
    name: item.name,
    price: Number(item.price),
    images: item.images,
    category: item.category,
    description: item.description ?? undefined
  }));

  return {
    shopName,
    products,
    shop: {
      address: shop.address ?? null,
      deliveryPrice:
        shop.delivery_price != null ? Number(shop.delivery_price) : null,
      whatsappPhone: shop.whatsapp_phone
    }
  };
};
