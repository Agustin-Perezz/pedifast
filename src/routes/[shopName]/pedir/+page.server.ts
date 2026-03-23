import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders, locals }) => {
  const { shopName } = params;

  setHeaders({
    'cache-control': 'public, max-age=30, stale-while-revalidate=60'
  });

  const result = await locals.shopsService.getShopWithProducts(shopName);

  if (!result) {
    error(404, `Shop "${shopName}" not found`);
  }

  return {
    shopName,
    products: result.products,
    shop: result.shop
  };
};
