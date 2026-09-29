import { describe, expect, it } from "vitest";
import { InvalidOrderError } from "./errors";
import { OrderFlow } from "./order-flow.enum";
import { Shop } from "./shop.entity";
import { makeShop } from "./testing/shop.factory";

const CONNECTED_AT = "2026-09-29T12:00:00.000Z";

describe("Shop", () => {
  it("stamps fresh id and timestamps when not provided", () => {
    const before = new Date().toISOString();

    const shop = Shop.create(makeBareShopInput());

    const after = new Date().toISOString();

    expect(shop.id).toBe(0);
    expect(shop.createdAt >= before).toBe(true);
    expect(shop.createdAt <= after).toBe(true);
    expect(shop.updatedAt >= before).toBe(true);
    expect(shop.updatedAt <= after).toBe(true);
  });

  it("creates a shop carrying its core identity fields", () => {
    const shop = makeShop({
      id: 2,
      deliveryPrice: 450,
      displayName: "Pizzería Luca",
      lat: -34.6037,
      lng: -58.3816,
      pricePerKm: 150,
    });

    expect(shop.id).toBe(2);
    expect(shop.shopName).toBe("pizzeria-luca");
    expect(shop.address).toBe("Av. San Martin 123");
    expect(shop.deliveryPrice).toBe(450);
    expect(shop.whatsappPhone).toBe("+5491234567890");
    expect(shop.displayName).toBe("Pizzería Luca");
    expect(shop.lat).toBe(-34.6037);
    expect(shop.lng).toBe(-58.3816);
    expect(shop.pricePerKm).toBe(150);
    expect(shop.createdAt).toBe("2026-01-01T00:00:00.000Z");
    expect(shop.updatedAt).toBe("2026-01-01T00:00:00.000Z");
  });

  it("rejects an empty address with a domain error naming the entity", () => {
    expect(() => makeShop({ address: "" })).toThrow(InvalidOrderError);
  });

  it("rejects an unknown order flow at the boundary", () => {
    expect(() => makeShop({ orderFlow: "phone" as OrderFlow })).toThrow(
      InvalidOrderError,
    );
  });

  it("reports the dashboard flow only for dashboard shops", () => {
    expect(
      makeShop({ orderFlow: OrderFlow.Whatsapp }).usesDashboardFlow(),
    ).toBe(false);
    expect(
      makeShop({ orderFlow: OrderFlow.Dashboard }).usesDashboardFlow(),
    ).toBe(true);
  });

  it("returns a new shop holding only the MP tokens and connection date changed", () => {
    const original = makeShop({ orderFlow: OrderFlow.Dashboard });
    const tokens = {
      mpAccessToken: "AT-xxx",
      mpRefreshToken: "RT-yyy",
      mpTokenExpiresAt: "2026-10-29T12:00:00.000Z",
      mpUserId: "mp-user-1",
      mpPublicKey: "PK-zzz",
      connectedAt: CONNECTED_AT,
    };

    const updated = original.withMpTokens(tokens);

    expect(updated.mpAccessToken).toBe(tokens.mpAccessToken);
    expect(updated.mpRefreshToken).toBe(tokens.mpRefreshToken);
    expect(updated.mpTokenExpiresAt).toBe(tokens.mpTokenExpiresAt);
    expect(updated.mpUserId).toBe(tokens.mpUserId);
    expect(updated.mpPublicKey).toBe(tokens.mpPublicKey);
    expect(updated.connectedAt).toBe(tokens.connectedAt);
    // Non-token identity is preserved
    expect(updated.id).toBe(original.id);
    expect(updated.shopName).toBe(original.shopName);
    expect(updated.address).toBe(original.address);
    expect(updated.createdAt).toBe(original.createdAt);
    // Immutability: the original instance is untouched
    expect(original.mpAccessToken).toBeNull();
  });

  it("exposes an immutable copy of its props through toObject", () => {
    const shop = makeShop({
      deliveryPrice: 450,
      displayName: "Pizzería Luca",
    });

    const props = shop.toObject();

    expect(props).toMatchObject({
      id: 1,
      shopName: "pizzeria-luca",
      deliveryPrice: 450,
      displayName: "Pizzería Luca",
      orderFlow: OrderFlow.Whatsapp,
    });
    expect(props).not.toBe(shop["props" as keyof Shop]);
  });
});

// Minimum input mirroring the DB column defaults (shops migration), so only
// id/timestamps arrive unstamped to the entity factory.
function makeBareShopInput(): Parameters<typeof Shop.create>[0] {
  return {
    shopName: "pizzeria-luca",
    address: "Av. San Martin 123",
    whatsappPhone: "+5491234567890",
    orderFlow: OrderFlow.Whatsapp,
    deliveryPrice: null,
    displayName: null,
    logoUrl: null,
    portraitUrl: null,
    openHours: null,
    lat: 0,
    lng: 0,
    pricePerKm: 0,
    dashboardPinHash: null,
    mpAccessToken: null,
    mpRefreshToken: null,
    mpTokenExpiresAt: null,
    mpUserId: null,
    mpPublicKey: null,
    connectedAt: null,
  };
}
