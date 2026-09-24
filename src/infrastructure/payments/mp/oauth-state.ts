import { createHmac, timingSafeEqual } from "node:crypto";

import { mpOauthStateSecret } from "@/lib/shared/infrastructure/env";

export const STATE_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes
export const EXPIRY_BUFFER_MS = 60 * 60 * 1000; // 1 hour

type OAuthStatePayload = {
  shop: string;
  timestamp: number;
  signature: string;
};

export function signOAuthState(shop: string, timestamp: number): string {
  return createHmac("sha256", mpOauthStateSecret)
    .update(`${shop}:${timestamp}`)
    .digest("hex");
}

export function createOAuthState(shop: string): string {
  const timestamp = Date.now();
  const payload: OAuthStatePayload = {
    shop,
    timestamp,
    signature: signOAuthState(shop, timestamp),
  };

  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function validateOAuthState(stateParam: string): string | null {
  let parsed: OAuthStatePayload;

  try {
    parsed = JSON.parse(
      Buffer.from(stateParam, "base64url").toString("utf-8"),
    ) as OAuthStatePayload;

    if (!parsed.shop || !parsed.timestamp || !parsed.signature) {
      return null;
    }
  } catch {
    return null;
  }

  if (Date.now() - parsed.timestamp > STATE_MAX_AGE_MS) {
    return null;
  }

  const expected = signOAuthState(parsed.shop, parsed.timestamp);
  const received = Buffer.from(parsed.signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  if (
    received.length !== expectedBuffer.length ||
    !timingSafeEqual(received, expectedBuffer)
  ) {
    return null;
  }

  return parsed.shop;
}
