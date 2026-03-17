import { createHmac, timingSafeEqual } from 'crypto';
import { redirect } from '@sveltejs/kit';

import {
  MP_API_BASE_URL,
  MP_APP_ID,
  MP_CLIENT_SECRET,
  MP_OAUTH_STATE_SECRET,
  MP_REDIRECT_URI
} from '$lib/server/env';
import { supabase } from '$lib/server/supabase';
import type { RequestHandler } from './$types';

const STATE_MAX_AGE_MS = 10 * 60 * 1000;

export const GET: RequestHandler = async ({ url }) => {
  const code = url.searchParams.get('code');
  const stateParam = url.searchParams.get('state');

  if (!code || !stateParam) {
    return new Response('Missing "code" or "state" parameter', { status: 400 });
  }

  let shop: string;
  let timestamp: number;
  let signature: string;
  try {
    const decoded = JSON.parse(
      Buffer.from(stateParam, 'base64url').toString('utf-8')
    );
    shop = decoded.shop;
    timestamp = decoded.timestamp;
    signature = decoded.signature;
    if (!shop || !timestamp || !signature) {
      throw new Error('Invalid state payload');
    }
  } catch {
    return new Response('OAuth callback failed', { status: 403 });
  }

  if (Date.now() - timestamp > STATE_MAX_AGE_MS) {
    return new Response('OAuth state expired', { status: 403 });
  }

  const expectedSignature = createHmac('sha256', MP_OAUTH_STATE_SECRET)
    .update(`${shop}:${timestamp}`)
    .digest('hex');

  const sigBuffer = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');
  if (
    sigBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return new Response('OAuth callback failed', { status: 403 });
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
