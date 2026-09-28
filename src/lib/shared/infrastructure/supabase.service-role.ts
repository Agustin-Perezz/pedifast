import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/infrastructure/database/postgres/database.types";
import { supabaseServiceRoleKey, supabaseUrl } from "./env";

// Server-only singleton for Realtime subscriptions and service-role writes.
// Created lazily so importing this module never fails on missing env vars at
// build time; callers (route handlers) run in the Node runtime.
let client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseServiceRoleClient() {
  if (!client) {
    client = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
      realtime: { params: { eventsPerSecond: 10 } },
    });
  }

  return client;
}
