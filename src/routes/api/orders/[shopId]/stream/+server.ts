import { createClient } from '@supabase/supabase-js';

import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from '$lib/server/env';
import {
  PANEL_COOKIE_NAME,
  verifySessionToken
} from '$lib/server/panel-session';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ params, cookies }) => {
  const shopId = parseInt(params.shopId);
  if (isNaN(shopId)) {
    return new Response('Invalid shop ID', { status: 400 });
  }

  const token = cookies.get(PANEL_COOKIE_NAME);
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  const session = verifySessionToken(token);
  if (!session || session.shopId !== shopId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      function send(event: string, data: unknown) {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      }

      const channel = supabase
        .channel(`orders-shop-${shopId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'orders',
            filter: `shop_id=eq.${shopId}`
          },
          (payload) => {
            send('new_order', payload.new);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `shop_id=eq.${shopId}`
          },
          (payload) => {
            send('order_updated', payload.new);
          }
        )
        .subscribe();

      const keepalive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': keepalive\n\n'));
        } catch {
          clearInterval(keepalive);
        }
      }, 30_000);

      send('connected', { shopId });

      controller.close = new Proxy(controller.close, {
        apply(target, thisArg, args) {
          clearInterval(keepalive);
          supabase.removeChannel(channel);
          return Reflect.apply(target, thisArg, args);
        }
      });
    },
    cancel() {
      supabase.removeAllChannels();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
};
