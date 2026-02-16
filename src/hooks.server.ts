import * as Sentry from '@sentry/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});

export const handle = sequence(Sentry.sentryHandle());

export const handleError = Sentry.handleErrorWithSentry();
