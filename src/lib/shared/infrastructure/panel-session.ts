import crypto from "node:crypto";

import { panelSessionSecret } from "./env";

export const PANEL_COOKIE_NAME = "panel_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const PIN_SALT_BYTES = 16;

export type PanelSessionPayload = {
  readonly shopId: number;
  readonly shopName: string;
  readonly exp: number;
};

export function hashPin(pin: string): string {
  const salt = crypto.randomBytes(PIN_SALT_BYTES).toString("hex");
  const hash = crypto
    .createHash("sha256")
    .update(salt + pin)
    .digest("hex");

  return `${salt}:${hash}`;
}

export function verifyPin(pin: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");

  if (!salt || !hash) {
    return false;
  }

  const candidate = crypto
    .createHash("sha256")
    .update(salt + pin)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(hash));
}

export function createSessionToken(shopId: number, shopName: string): string {
  const payload: PanelSessionPayload = {
    shopId,
    shopName,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", panelSessionSecret)
    .update(data)
    .digest("base64url");

  return `${data}.${signature}`;
}

export function verifySessionToken(
  token: string | undefined | null,
): PanelSessionPayload | null {
  if (!token) {
    return null;
  }

  const [data, signature] = token.split(".");

  if (!data || !signature) {
    return null;
  }

  const expected = crypto
    .createHmac("sha256", panelSessionSecret)
    .update(data)
    .digest("base64url");

  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString(),
    ) as PanelSessionPayload;

    if (
      typeof payload.shopId !== "number" ||
      typeof payload.shopName !== "string" ||
      typeof payload.exp !== "number" ||
      payload.exp < Date.now()
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
