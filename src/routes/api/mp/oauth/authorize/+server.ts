import { redirect } from '@sveltejs/kit';

import { mpService } from '$lib/server/mp-client';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
  const shop = url.searchParams.get('shop');
  if (!shop) {
    return new Response('Missing "shop" query parameter', { status: 400 });
  }

  const authUrl = mpService.getAuthorizationURL(shop);
  redirect(302, authUrl);
};
