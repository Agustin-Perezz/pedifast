import { error } from '@sveltejs/kit';

import { supabase } from '$lib/server/supabase';
import type {
  AccessoryGroup,
  AccessorySelectionMode,
  Product
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

interface RawAccessoryGroupRow extends RawAccessoryGroup {
  shop_item_id: number;
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

  const itemIds = (shopData.shop_items ?? []).map((item) => {
    return item.id;
  });

  const { data: accessoryData } =
    itemIds.length > 0
      ? await supabase
          .from('accessory_groups')
          .select(
            'id, shop_item_id, name, selection_mode, is_required, sort_order, accessory_options(id, name, price_delta, sort_order)'
          )
          .in('shop_item_id', itemIds)
      : { data: [] as RawAccessoryGroupRow[] };

  const accessoryMap = new Map<number, RawAccessoryGroup[]>();
  for (const group of accessoryData ?? []) {
    const existing = accessoryMap.get(group.shop_item_id) ?? [];
    existing.push({
      id: group.id,
      name: group.name,
      selection_mode: group.selection_mode,
      is_required: group.is_required,
      sort_order: group.sort_order,
      accessory_options: (group.accessory_options ?? []) as RawAccessoryOption[]
    });
    accessoryMap.set(group.shop_item_id, existing);
  }

  const products: Product[] = [...(shopData.shop_items ?? [])]
    .sort((a, b) => a.id - b.id)
    .map((item) => ({
      id: String(item.id),
      name: item.name,
      price: Number(item.price),
      images: item.images,
      category: item.category,
      description: item.description ?? undefined,
      accessoryGroups: mapAccessoryGroups(accessoryMap.get(item.id) ?? null)
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
