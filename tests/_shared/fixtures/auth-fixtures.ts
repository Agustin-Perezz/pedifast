import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/infrastructure/database/postgres/database.types";
import {
  supabaseTestServiceRoleKey,
  supabaseTestUrl,
} from "./supabase-test-client";

const AUTH_STORAGE_KEY = "sb-127-auth-token";
const APP_COOKIE_DOMAIN = "localhost";
const APP_COOKIE_PATH = "/";
const PASSWORD = "Test1234!";

export type TestUser = {
  id: string;
  email: string;
  password: string;
};

export async function createTestUser(
  admin: SupabaseClient<Database>,
): Promise<TestUser> {
  const id = crypto.randomUUID();
  const email = `e2e-${id}@test.com`;

  const { error } = await admin.auth.admin.createUser({
    id,
    email,
    password: PASSWORD,
    email_confirm: true,
  });

  if (error) {
    throw new Error(`Failed to create test user: ${error.message}`);
  }

  return { id, email, password: PASSWORD };
}

export async function deleteTestUser(
  admin: SupabaseClient<Database>,
  userId: string,
): Promise<void> {
  const { error } = await admin.auth.admin.deleteUser(userId);

  if (error) {
    throw new Error(`Failed to delete test user: ${error.message}`);
  }
}

export type SessionCookies = {
  name: string;
  value: string;
  domain: string;
  path: string;
}[];

export async function signInAndGetCookies(
  email: string,
  password: string,
): Promise<SessionCookies> {
  // Use a separate ephemeral client so the admin client's auth state is not mutated.
  const ephemeralClient = createClient<Database>(
    supabaseTestUrl,
    supabaseTestServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  const { data, error } = await ephemeralClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    throw new Error(`Failed to sign in for cookies: ${error?.message}`);
  }

  const sessionPayload = JSON.stringify({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
    expires_in: data.session.expires_in,
    token_type: data.session.token_type,
    user: data.user,
  });

  return [
    {
      name: AUTH_STORAGE_KEY,
      value: sessionPayload,
      domain: APP_COOKIE_DOMAIN,
      path: APP_COOKIE_PATH,
    },
  ];
}
