import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/shared/infrastructure/env", () => ({
  mpOauthStateSecret: "state-secret",
}));

const { createOAuthState, validateOAuthState } = await import("./oauth-state");

describe("oauth-state", () => {
  it("round-trips a signed state for a shop", () => {
    const state = createOAuthState("pizzeria-luca");

    expect(validateOAuthState(state)).toBe("pizzeria-luca");
  });

  it("rejects a state whose signature was tampered", () => {
    const state = createOAuthState("pizzeria-luca");
    const tampered = JSON.stringify({
      ...JSON.parse(Buffer.from(state, "base64url").toString()),
      shop: "other-shop",
    });

    expect(
      validateOAuthState(Buffer.from(tampered).toString("base64url")),
    ).toBeNull();
  });

  it("rejects an expired state (older than 10 minutes)", () => {
    const expired = Buffer.from(
      JSON.stringify({
        shop: "pizzeria-luca",
        timestamp: Date.now() - 11 * 60 * 1000,
        signature: "irrelevant-but-present",
      }),
    ).toString("base64url");

    expect(validateOAuthState(expired)).toBeNull();
  });

  it("rejects garbage states", () => {
    expect(validateOAuthState("not-base64url-json")).toBeNull();
    expect(validateOAuthState("")).toBeNull();
  });
});
