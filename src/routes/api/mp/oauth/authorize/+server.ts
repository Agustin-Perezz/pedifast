import { redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url, locals }) => {
  const shop = url.searchParams.get('shop');
  if (!shop) {
    return new Response('Missing "shop" query parameter', { status: 400 });
  }

  const authUrl = locals.mpClient.getAuthorizationURL(shop);
  redirect(302, authUrl);
};
