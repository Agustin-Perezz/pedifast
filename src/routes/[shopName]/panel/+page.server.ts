import { fail } from '@sveltejs/kit';
import { z } from 'zod';

import { OrderStatus } from '$lib/schemas/order';
import {
  PANEL_COOKIE_NAME,
  verifySessionToken
} from '$lib/server/panel-session';
import type { Actions, PageServerLoad } from './$types';

const orderActionSchema = z.object({
  orderId: z.coerce.number()
});

function getShopIdFromCookie(cookies: {
  get: (name: string) => string | undefined;
}): number {
  const token = cookies.get(PANEL_COOKIE_NAME);
  if (!token) {
    throw new Error('Unauthorized');
  }
  const session = verifySessionToken(token);
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session.shopId;
}

export const load: PageServerLoad = async ({ parent, locals }) => {
  const { shopId } = await parent();

  const orders = await locals.ordersService.getShopOrders(shopId);

  return { orders, shopId };
};

export const actions = {
  confirm: async ({ request, locals, cookies }) => {
    const shopId = getShopIdFromCookie(cookies);
    const formData = await request.formData();
    const parsed = orderActionSchema.safeParse({
      orderId: formData.get('orderId')
    });

    if (!parsed.success) {
      return fail(400, { error: 'ID de pedido inválido' });
    }

    try {
      const order = await locals.ordersService.confirmOrder(
        parsed.data.orderId,
        shopId
      );
      return {
        success: true,
        action: OrderStatus.enum.confirmed,
        order
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al confirmar el pedido';
      return fail(400, { error: message });
    }
  },

  reject: async ({ request, locals, cookies }) => {
    const shopId = getShopIdFromCookie(cookies);
    const formData = await request.formData();
    const parsed = orderActionSchema.safeParse({
      orderId: formData.get('orderId')
    });

    if (!parsed.success) {
      return fail(400, { error: 'ID de pedido inválido' });
    }

    try {
      const order = await locals.ordersService.rejectOrder(
        parsed.data.orderId,
        shopId
      );
      return {
        success: true,
        action: OrderStatus.enum.rejected,
        order
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Error al rechazar el pedido';
      return fail(400, { error: message });
    }
  }
} satisfies Actions;
