import { env } from '$env/dynamic/private';

function required(key: string): string {
  const value = env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const MP_APP_ID = required('MP_APP_ID');
export const MP_CLIENT_SECRET = required('MP_CLIENT_SECRET');
export const MP_REDIRECT_URI = required('MP_REDIRECT_URI');

export const MP_OAUTH_STATE_SECRET = required('MP_OAUTH_STATE_SECRET');

export const SUPABASE_URL = required('SUPABASE_URL');
export const SUPABASE_SERVICE_ROLE_KEY = required('SUPABASE_SERVICE_ROLE_KEY');

export const MAPBOX_ACCESS_TOKEN = required('MAPBOX_ACCESS_TOKEN');
export const MAPBOX_BASE_URL = required('MAPBOX_BASE_URL');
