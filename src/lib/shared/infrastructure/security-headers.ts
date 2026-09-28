// Security response headers ported verbatim from the legacy SvelteKit app
// (`pedifast-old/src/hooks.server.ts`, read-only reference). The always-on
// headers are applied statically via `next.config.ts`; the host-conditional
// Content-Security-Policy is applied at request time in `src/proxy.ts`.

export type SecurityHeader = {
  readonly key: string;
  readonly value: string;
};

export const securityHeaders: readonly SecurityHeader[] = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

export const CONTENT_SECURITY_POLICY_HEADER_KEY = "Content-Security-Policy";

// Applied only when the request host is not `localhost` (parity with the old
// app's `if (event.url.hostname !== 'localhost')` guard).
export const LOCALHOST_HOSTNAME = "localhost";

const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.mercadopago.com https://http2.mlstatic.com https://vercel.live https://unpkg.com blob:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
  "img-src 'self' data: https://http2.mlstatic.com https://*.supabase.co https://*.tile.openstreetmap.org",
  "frame-src https://*.mercadopago.com.ar https://*.mercadopago.com https://vercel.live",
  "connect-src 'self' https://api.mercadopago.com https://*.sentry.io",
  "font-src 'self' https://fonts.gstatic.com",
  "worker-src 'self' blob:",
] as const;

export const contentSecurityPolicy = CSP_DIRECTIVES.join("; ");
