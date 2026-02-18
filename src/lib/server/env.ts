import { env } from '$env/dynamic/private';

function required(key: string): string {
  const value = env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const MP_AUTH_BASE_URL =
  env.MP_AUTH_BASE_URL ?? 'https://auth.mercadopago.com';
export const MP_API_BASE_URL =
  env.MP_API_BASE_URL ?? 'https://api.mercadopago.com';
export const MP_APP_ID = required('MP_APP_ID');
export const MP_CLIENT_SECRET = required('MP_CLIENT_SECRET');
export const MP_REDIRECT_URI = required('MP_REDIRECT_URI');

export const SUPABASE_URL = required('SUPABASE_URL');
export const SUPABASE_SERVICE_ROLE_KEY = required('SUPABASE_SERVICE_ROLE_KEY');
