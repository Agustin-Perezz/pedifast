import { redirect } from '@sveltejs/kit';

import {
  PANEL_COOKIE_NAME,
  verifySessionToken
} from '$lib/server/panel-session';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, cookies, url }) => {
  const { shopName } = params;

  if (url.pathname.endsWith('/login')) {
    return { shopName, shopId: 0 };
  }

  const token = cookies.get(PANEL_COOKIE_NAME);
  if (!token) {
    redirect(302, `/${shopName}/panel/login`);
  }

  const session = verifySessionToken(token);
  if (!session || session.shopName !== shopName) {
    cookies.delete(PANEL_COOKIE_NAME, { path: '/' });
    redirect(302, `/${shopName}/panel/login`);
  }

  return {
    shopName: session.shopName,
    shopId: session.shopId
  };
};
