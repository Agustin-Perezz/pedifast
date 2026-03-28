import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';

import {
  createSessionToken,
  PANEL_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  verifyPin,
  verifySessionToken
} from '$lib/server/panel-session';
import type { Actions, PageServerLoad } from './$types';

const pinSchema = z.object({
  pin: z.string().min(1, 'Ingresá el PIN')
});

export const load: PageServerLoad = async ({ cookies, params }) => {
  const token = cookies.get(PANEL_COOKIE_NAME);
  if (token) {
    const session = verifySessionToken(token);
    if (session && session.shopName === params.shopName) {
      redirect(302, `/${params.shopName}/panel`);
    }
  }
  return {};
};

export const actions = {
  default: async ({ request, locals, params, cookies }) => {
    const formData = await request.formData();
    const parsed = pinSchema.safeParse({
      pin: formData.get('pin')
    });

    if (!parsed.success) {
      return fail(400, { error: 'Ingresá el PIN' });
    }

    const shopMeta = await locals.shopsService.getShopMeta(params.shopName);
    if (!shopMeta || !shopMeta.dashboard_pin_hash) {
      return fail(400, {
        error: 'El panel no está habilitado para este local'
      });
    }

    const valid = verifyPin(parsed.data.pin, shopMeta.dashboard_pin_hash);
    if (!valid) {
      return fail(400, { error: 'PIN incorrecto' });
    }

    const token = createSessionToken(shopMeta.id, shopMeta.shop_name);
    cookies.set(PANEL_COOKIE_NAME, token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE_SECONDS
    });

    redirect(302, `/${params.shopName}/panel`);
  }
} satisfies Actions;
