import { redirect } from '@sveltejs/kit';

import { mpService } from '$lib/server/mp-client';
import { supabase } from '$lib/server/supabase';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const code = url.searchParams.get('code');
  const stateParam = url.searchParams.get('state');

  if (!code || !stateParam) {
    return new Response('Missing "code" or "state" parameter', { status: 400 });
  }

  let shop: string;
  try {
    ({ shop } = mpService.validateOAuthState(stateParam));
  } catch {
    return new Response('OAuth callback failed', { status: 403 });
  }

  let tokenData;
  try {
    tokenData = await mpService.exchangeCodeForTokens(code);
  } catch {
    return new Response('OAuth callback failed', { status: 502 });
  }

  const expiresAt = new Date(
    Date.now() + tokenData.expires_in * 1000
  ).toISOString();

  const { error: dbError, count } = await supabase
    .from('shops')
    .update({
      mp_access_token: tokenData.access_token,
      mp_refresh_token: tokenData.refresh_token,
      mp_token_expires_at: expiresAt,
      mp_user_id: String(tokenData.user_id),
      mp_public_key: tokenData.public_key,
      connected_at: new Date().toISOString()
    })
    .eq('shop_name', shop);

  if (dbError) {
    return new Response('OAuth callback failed', { status: 500 });
  }

  if (count === 0) {
    console.error(`OAuth callback: shop "${shop}" not found in database`);
    return new Response('OAuth callback failed', { status: 404 });
  }

  redirect(302, `/${shop}/pedir?mp_connected=true`);
};
