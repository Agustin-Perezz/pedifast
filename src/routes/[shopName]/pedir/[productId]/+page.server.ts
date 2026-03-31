import { error } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders, locals }) => {
  const { shopName, productId } = params;

  setHeaders({
    'cache-control': 'public, max-age=30, stale-while-revalidate=60'
  });

  const result = await locals.shopsService.getProductDetail(
    shopName,
    Number(productId)
  );

  if ('error' in result) {
    switch (result.error) {
      case 'shop_not_found':
        error(404, 'Shop not found');
        break;
      case 'product_not_found':
        error(404, 'Product not found');
        break;
    }
  }

  return {
    product: result.product,
    shopName
  };
};
