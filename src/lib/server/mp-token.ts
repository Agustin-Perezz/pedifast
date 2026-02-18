import { MP_API_BASE_URL, MP_APP_ID, MP_CLIENT_SECRET } from './env';
import { supabase } from './supabase';

const EXPIRY_BUFFER_MS = 60 * 60 * 1000; // 1 hour

export async function getSellerAccessToken(shopName: string): Promise<string> {
  const { data: shop, error } = await supabase
    .from('shops')
    .select('mp_access_token, mp_refresh_token, mp_token_expires_at')
    .eq('shop_name', shopName)
    .single();

  if (error || !shop) {
    throw new Error(
      `Shop "${shopName}" not found or not connected to Mercado Pago`
    );
  }

  const expiresAt = new Date(shop.mp_token_expires_at).getTime();
  const isExpired = Date.now() + EXPIRY_BUFFER_MS >= expiresAt;

  if (!isExpired) {
    return shop.mp_access_token;
  }

  const refreshResponse = await fetch(`${MP_API_BASE_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: MP_APP_ID,
      client_secret: MP_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: shop.mp_refresh_token
    })
  });

  if (!refreshResponse.ok) {
    const errorText = await refreshResponse.text();
    console.error('MP token refresh failed:', errorText);
    throw new Error('Failed to refresh Mercado Pago token');
  }

  const tokenData = await refreshResponse.json();
  const newExpiresAt = new Date(
    Date.now() + tokenData.expires_in * 1000
  ).toISOString();

  const { error: updateError } = await supabase
    .from('shops')
    .update({
      mp_access_token: tokenData.access_token,
      mp_refresh_token: tokenData.refresh_token,
      mp_token_expires_at: newExpiresAt
    })
    .eq('shop_name', shopName);

  if (updateError) {
    console.error('Failed to update refreshed tokens:', updateError);
  }

  return tokenData.access_token;
}
