import { redirect } from '@sveltejs/kit';

import {
  MP_API_BASE_URL,
  MP_APP_ID,
  MP_CLIENT_SECRET,
  MP_REDIRECT_URI
} from '$lib/server/env';
import { supabase } from '$lib/server/supabase';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  const code = url.searchParams.get('code');
  const shopName = url.searchParams.get('state');

  if (!code || !shopName) {
    return new Response('Missing "code" or "state" parameter', { status: 400 });
  }

  const tokenResponse = await fetch(`${MP_API_BASE_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: MP_APP_ID,
      client_secret: MP_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: MP_REDIRECT_URI
    })
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text();
    console.error('MP OAuth token exchange failed:', error);
    return new Response('Failed to exchange authorization code', {
      status: 502
    });
  }

  const tokenData = await tokenResponse.json();

  const expiresAt = new Date(
    Date.now() + tokenData.expires_in * 1000
  ).toISOString();

  const { error: dbError } = await supabase.from('shops').upsert(
    {
      shop_name: shopName,
      mp_access_token: tokenData.access_token,
      mp_refresh_token: tokenData.refresh_token,
      mp_token_expires_at: expiresAt,
      mp_user_id: String(tokenData.user_id),
      mp_public_key: tokenData.public_key,
      connected_at: new Date().toISOString()
    },
    { onConflict: 'shop_name' }
  );

  if (dbError) {
    console.error('Failed to save MP tokens:', dbError);
    return new Response('Failed to save credentials', { status: 500 });
  }

  redirect(302, `/${shopName}/pedir?mp_connected=true`);
};
