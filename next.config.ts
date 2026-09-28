import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

import { securityHeaders } from "@/lib/shared/infrastructure/security-headers";

const nextConfig: NextConfig = {
  // Emit client source maps for the production build so Playwright/Monocart
  // V8 coverage can resolve browser JS back to `src/`. Without this the LCOV
  // records `SF:` paths against bundled chunks and SonarCloud cannot map
  // coverage to source. (Server-side coverage comes from the Vitest unit layer.)
  productionBrowserSourceMaps: true,
  // Always-on security headers, ported verbatim from the legacy SvelteKit app.
  // The host-conditional Content-Security-Policy is applied at request time in
  // `src/proxy.ts` (it must inspect the request hostname, unavailable here).
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders.map(({ key, value }) => ({ key, value })),
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  sourcemaps: { disable: false },
});
