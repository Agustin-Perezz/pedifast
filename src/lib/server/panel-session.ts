import crypto from 'node:crypto';

import { PANEL_SESSION_SECRET } from '$lib/server/env';

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function hashPin(pin: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .createHash('sha256')
    .update(salt + pin)
    .digest('hex');
  return `${salt}:${hash}`;
}

export function verifyPin(pin: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) {
    return false;
  }
  const candidate = crypto
    .createHash('sha256')
    .update(salt + pin)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(hash));
}

interface SessionPayload {
  shopId: number;
  shopName: string;
  exp: number;
}

export function createSessionToken(shopId: number, shopName: string): string {
  const payload: SessionPayload = {
    shopId,
    shopName,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', PANEL_SESSION_SECRET)
    .update(data)
    .digest('base64url');
  return `${data}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [data, signature] = token.split('.');
  if (!data || !signature) {
    return null;
  }

  const expected = crypto
    .createHmac('sha256', PANEL_SESSION_SECRET)
    .update(data)
    .digest('base64url');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  try {
    const payload: SessionPayload = JSON.parse(
      Buffer.from(data, 'base64url').toString()
    );
    if (payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export const PANEL_COOKIE_NAME = 'panel_session';
export { SESSION_MAX_AGE_SECONDS };
