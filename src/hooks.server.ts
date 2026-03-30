import * as Sentry from '@sentry/sveltekit';
import { createClient } from '@supabase/supabase-js';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from '$lib/server/env';
import { MercadoPagoClient } from '$lib/server/mp-client';
import { AccessoryGroupsRepository } from '$lib/server/repositories/accessory-groups.repository';
import { OrdersRepository } from '$lib/server/repositories/orders.repository';
import { ShopItemsRepository } from '$lib/server/repositories/shop-items.repository';
import { ShopsRepository } from '$lib/server/repositories/shops.repository';
import { OrdersService } from '$lib/server/services/orders.service';
import { ShopsService } from '$lib/server/services/shops.service';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});

const locals: Handle = async ({ event, resolve }) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const shopsRepo = new ShopsRepository(supabase);
  const accessoryGroupsRepo = new AccessoryGroupsRepository(supabase);
  const shopItemsRepo = new ShopItemsRepository(supabase);
  const ordersRepo = new OrdersRepository(supabase);

  const shopsService = new ShopsService(
    shopsRepo,
    accessoryGroupsRepo,
    shopItemsRepo
  );

  const ordersService = new OrdersService(ordersRepo, shopsRepo);

  event.locals.shopsService = shopsService;
  event.locals.ordersService = ordersService;
  event.locals.mpClient = new MercadoPagoClient(shopsService);

  return resolve(event);
};

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
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.mercadopago.com https://http2.mlstatic.com https://vercel.live https://unpkg.com blob:",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
        "img-src 'self' data: https://http2.mlstatic.com https://*.supabase.co https://*.tile.openstreetmap.org",
        'frame-src https://*.mercadopago.com.ar https://*.mercadopago.com',
        "connect-src 'self' https://api.mercadopago.com https://*.sentry.io",
        "font-src 'self' https://fonts.gstatic.com",
        "worker-src 'self' blob:"
      ].join('; ')
    );
  }

  return response;
};

export const handle = sequence(Sentry.sentryHandle(), locals, securityHeaders);

export const handleError = Sentry.handleErrorWithSentry();
