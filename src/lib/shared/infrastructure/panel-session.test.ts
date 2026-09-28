import crypto from "node:crypto";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/shared/infrastructure/env", () => ({
  panelSessionSecret: "test-secret",
}));

const { createSessionToken, hashPin, verifyPin, verifySessionToken } =
  await import("@/lib/shared/infrastructure/panel-session");

describe("panel-session", () => {
  describe("hashPin", () => {
    it("produces a salt:hash format with a 16-byte hex salt", () => {
      const stored = hashPin("1234");

      const [salt, hash] = stored.split(":");

      expect(salt).toHaveLength(32);
      expect(hash).toHaveLength(64);
      expect(stored).toMatch(/^[0-9a-f]{32}:[0-9a-f]{64}$/);
    });

    it("salts each hash so identical PINs differ", () => {
      expect(hashPin("1234")).not.toBe(hashPin("1234"));
    });
  });

  describe("verifyPin", () => {
    it("accepts the correct PIN", () => {
      const stored = hashPin("1234");

      expect(verifyPin("1234", stored)).toBe(true);
    });

    it("rejects a wrong PIN", () => {
      const stored = hashPin("1234");

      expect(verifyPin("9999", stored)).toBe(false);
    });

    it("rejects a malformed stored hash", () => {
      expect(verifyPin("1234", "garbage")).toBe(false);
      expect(verifyPin("1234", "onlysalt:")).toBe(false);
      expect(verifyPin("1234", "")).toBe(false);
    });
  });

  describe("createSessionToken / verifySessionToken", () => {
    it("round-trips shop id and shop name", () => {
      const token = createSessionToken(7, "pizzeria-luca");
      const session = verifySessionToken(token);

      expect(session?.shopId).toBe(7);
      expect(session?.shopName).toBe("pizzeria-luca");
      expect(session?.exp).toBeGreaterThan(Date.now());
    });

    it("issues an exp roughly 7 days ahead", () => {
      const before = Date.now();
      const token = createSessionToken(7, "pizzeria-luca");
      const after = Date.now();
      const session = verifySessionToken(token);

      expect(session?.exp).toBeGreaterThanOrEqual(
        before + 7 * 24 * 60 * 60 * 1000 - 1,
      );
      expect(session?.exp).toBeLessThanOrEqual(after + 7 * 24 * 60 * 60 * 1000);
    });

    it("rejects a token signed with a different secret", () => {
      const forged = `${Buffer.from(
        JSON.stringify({
          shopId: 7,
          shopName: "pizzeria-luca",
          exp: Date.now() + 1e9,
        }),
      ).toString("base64url")}.definitely-not-a-valid-signature`;

      expect(verifySessionToken(forged)).toBeNull();
    });

    it("rejects an expired token", () => {
      const payload = {
        shopId: 7,
        shopName: "pizzeria-luca",
        exp: Date.now() - 1000,
      };
      const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
      const signature = crypto
        .createHmac("sha256", "test-secret")
        .update(data)
        .digest("base64url");
      const token = `${data}.${signature}`;

      expect(verifySessionToken(token)).toBeNull();
    });

    it("rejects tampered payloads", () => {
      const token = createSessionToken(7, "pizzeria-luca");
      const [data] = token.split(".");
      const tampered = Buffer.from(
        JSON.stringify({
          shopId: 8,
          shopName: "other-shop",
          exp: Date.now() + 1e9,
        }),
      ).toString("base64url");

      expect(
        verifySessionToken(`${tampered}.${token.split(".")[1]}`),
      ).toBeNull();
      expect(verifySessionToken(token)).not.toBeNull();
      expect(data).toBeDefined();
    });

    it("rejects missing/empty tokens", () => {
      expect(verifySessionToken(undefined)).toBeNull();
      expect(verifySessionToken("")).toBeNull();
      expect(verifySessionToken("nodots")).toBeNull();
    });
  });
});
