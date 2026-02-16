import * as Sentry from '@sentry/sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { createServerClient } from '$lib/supabase';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});

const supabaseHandle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(event);

  event.locals.safeGetSession = async () => {
    const {
      data: { user },
      error
    } = await event.locals.supabase.auth.getUser();

    if (error) {
      return { session: null, user: null };
    }

    const {
      data: { session }
    } = await event.locals.supabase.auth.getSession();

    return { session, user };
  };

  const { session, user } = await event.locals.safeGetSession();
  event.locals.session = session;
  event.locals.user = user;

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version';
    }
  });
};

const authGuardHandle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/protected')) {
    if (!event.locals.user) {
      throw redirect(303, '/login');
    }
  }

  return resolve(event);
};

export const handle = sequence(
  Sentry.sentryHandle(),
  supabaseHandle,
  authGuardHandle
);

export const handleError = Sentry.handleErrorWithSentry();
