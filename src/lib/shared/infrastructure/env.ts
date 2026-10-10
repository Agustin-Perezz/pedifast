const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL — set it in your .env file",
  );
}

if (!publishableKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — set it in your .env file",
  );
}

function requiredServerEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name} — set it in your .env file`);
  }

  return value;
}

function requiredBooleanServerEnv(name: string): boolean {
  const value = process.env[name];

  if (value !== "true" && value !== "false") {
    throw new Error(
      `Missing ${name} — set it to "true" or "false" in your .env file`,
    );
  }

  return value === "true";
}

export const supabaseUrl = url;
export const supabasePublishableKey = publishableKey;

export const supabaseServiceRoleKey = requiredServerEnv(
  "SUPABASE_SERVICE_ROLE_KEY",
);

export const mpAppId = requiredServerEnv("MP_APP_ID");
export const mpClientSecret = requiredServerEnv("MP_CLIENT_SECRET");
export const mpRedirectUri = requiredServerEnv("MP_REDIRECT_URI");
export const mpOauthStateSecret = requiredServerEnv("MP_OAUTH_STATE_SECRET");
export const mpOauthTestToken = requiredBooleanServerEnv("MP_OAUTH_TEST_TOKEN");

export const googleMapsApiKey = requiredServerEnv("GOOGLE_MAPS_API_KEY");
export const googleMapsBaseUrl = requiredServerEnv("GOOGLE_MAPS_BASE_URL");

export const panelSessionSecret = requiredServerEnv("PANEL_SESSION_SECRET");
