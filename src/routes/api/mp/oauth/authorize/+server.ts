import { redirect } from '@sveltejs/kit';

import { MP_APP_ID, MP_AUTH_BASE_URL, MP_REDIRECT_URI } from '$lib/server/env';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
  const shop = url.searchParams.get('shop');
  if (!shop) {
    return new Response('Missing "shop" query parameter', { status: 400 });
  }

  const authUrl = new URL(`${MP_AUTH_BASE_URL}/authorization`);
  authUrl.searchParams.set('client_id', MP_APP_ID);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('platform_id', 'mp');
  authUrl.searchParams.set('state', shop);
  authUrl.searchParams.set('redirect_uri', MP_REDIRECT_URI);

  redirect(302, authUrl.toString());
};
