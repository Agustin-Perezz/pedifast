import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/infrastructure/database/postgres/database.types";

export const supabaseTestUrl =
  process.env.SUPABASE_URL ?? "http://127.0.0.1:55321";
export const supabaseTestServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

export const supabaseTestClient = createClient<Database>(
  supabaseTestUrl,
  supabaseTestServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
