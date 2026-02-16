import { env } from '$env/dynamic/public';
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    env.PUBLIC_SUPABASE_URL!,
    env.PUBLIC_SUPABASE_ANON_KEY!
  );
}
