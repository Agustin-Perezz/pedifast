import { createHmac } from 'crypto';
import { redirect } from '@sveltejs/kit';

import {
  MP_APP_ID,
  MP_AUTH_BASE_URL,
  MP_OAUTH_STATE_SECRET,
  MP_REDIRECT_URI
} from '$lib/server/env';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
  const shop = url.searchParams.get('shop');
  if (!shop) {
    return new Response('Missing "shop" query parameter', { status: 400 });
  }

  const timestamp = Date.now();
  const signature = createHmac('sha256', MP_OAUTH_STATE_SECRET)
    .update(`${shop}:${timestamp}`)
    .digest('hex');

  const state = Buffer.from(
    JSON.stringify({ shop, timestamp, signature })
  ).toString('base64url');

  const authUrl = new URL(`${MP_AUTH_BASE_URL}/authorization`);
  authUrl.searchParams.set('client_id', MP_APP_ID);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('platform_id', 'mp');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('redirect_uri', MP_REDIRECT_URI);

  redirect(302, authUrl.toString());
};
