import * as Sentry from '@sentry/sveltekit';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});

const securityHeaders: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  if (event.url.hostname !== 'localhost') {
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.mercadopago.com https://http2.mlstatic.com blob:",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: https://http2.mlstatic.com https://*.supabase.co",
        'frame-src https://*.mercadopago.com.ar https://*.mercadopago.com',
        "connect-src 'self' https://api.mercadopago.com https://*.sentry.io",
        "font-src 'self' https://fonts.gstatic.com",
        "worker-src 'self' blob:"
      ].join('; ')
    );
  }

  return response;
};

export const handle = sequence(Sentry.sentryHandle(), securityHeaders);

export const handleError = Sentry.handleErrorWithSentry();
