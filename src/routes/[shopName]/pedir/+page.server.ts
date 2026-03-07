import { error } from '@sveltejs/kit';

import { supabase } from '$lib/server/supabase';
import type { Product } from '$lib/types/product';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
  const { shopName } = params;

  setHeaders({
    'cache-control': 'public, max-age=30, stale-while-revalidate=60'
  });

  const { data: shopData, error: shopError } = await supabase
    .from('shops')
    .select(
      'id, address, delivery_price, whatsapp_phone, shop_items(id, name, price, category, images, description)'
    )
    .eq('shop_name', shopName)
    .single();

  if (shopError || !shopData) {
    error(404, `Shop "${shopName}" not found`);
  }

  const products: Product[] = [...(shopData.shop_items ?? [])]
    .sort((a, b) => a.id - b.id)
    .map((item) => ({
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
      address: shopData.address ?? null,
      deliveryPrice:
        shopData.delivery_price != null
          ? Number(shopData.delivery_price)
          : null,
      whatsappPhone: shopData.whatsapp_phone
    }
  };
};
