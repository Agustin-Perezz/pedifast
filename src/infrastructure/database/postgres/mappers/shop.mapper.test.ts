import { describe, expect, it } from "vitest";
import { OrderFlow } from "@/domain/entities/order-flow.enum";
import type { ShopRow } from "../entities/shop.entity";
import { shopMapper } from "./shop.mapper";

const row: ShopRow = {
  id: 2,
  shop_name: "pizzeria-luca",
  address: "Av. San Martin 123",
  delivery_price: 450,
  whatsapp_phone: "+5491234567890",
  display_name: "Pizzería Luca",
  logo_url: "https://cdn.example.com/luca-logo.webp",
  portrait_url: "https://cdn.example.com/luca-portrait.webp",
  open_hours: "mon-sun 11:00-23:00",
  lat: -34.6037,
  lng: -58.3816,
  price_per_km: 150,
  order_flow: "whatsapp",
  dashboard_pin_hash: null,
  mp_access_token: null,
  mp_refresh_token: null,
  mp_token_expires_at: null,
  mp_user_id: null,
  mp_public_key: null,
  connected_at: null,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

const CREATED_AT = "2026-01-01T00:00:00.000Z";
const UPDATED_AT = "2026-01-01T00:00:00.000Z";

describe("shopMapper", () => {
  it("maps a row without MP credentials to a domain Shop with nulls preserved", () => {
    const shop = shopMapper.toDomain(row);

    expect(shop.id).toBe(row.id);
    expect(shop.shopName).toBe(row.shop_name);
    expect(shop.address).toBe(row.address);
    expect(shop.deliveryPrice).toBe(row.delivery_price);
    expect(shop.whatsappPhone).toBe(row.whatsapp_phone);
    expect(shop.displayName).toBe(row.display_name);
    expect(shop.logoUrl).toBe(row.logo_url);
    expect(shop.portraitUrl).toBe(row.portrait_url);
    expect(shop.openHours).toBe(row.open_hours);
    expect(shop.lat).toBe(row.lat);
    expect(shop.lng).toBe(row.lng);
    expect(shop.pricePerKm).toBe(row.price_per_km);
    expect(shop.orderFlow).toBe(OrderFlow.Whatsapp);
    expect(shop.dashboardPinHash).toBeNull();
    expect(shop.mpAccessToken).toBeNull();
    expect(shop.mpRefreshToken).toBeNull();
    expect(shop.mpTokenExpiresAt).toBeNull();
    expect(shop.mpUserId).toBeNull();
    expect(shop.mpPublicKey).toBeNull();
    expect(shop.connectedAt).toBeNull();
    expect(shop.createdAt).toBe(CREATED_AT);
    expect(shop.updatedAt).toBe(UPDATED_AT);
  });

  it("maps a connected dashboard shop row with MP tokens and pin hash", () => {
    const shop = shopMapper.toDomain({
      ...row,
      order_flow: "dashboard",
      dashboard_pin_hash: "pin-hash",
      mp_access_token: "AT-xxx",
      mp_refresh_token: "RT-yyy",
      mp_token_expires_at: "2026-10-29T12:00:00.000Z",
      mp_user_id: "mp-user-1",
      mp_public_key: "PK-zzz",
      connected_at: "2026-09-29T12:00:00.000Z",
    });

    expect(shop.orderFlow).toBe(OrderFlow.Dashboard);
    expect(shop.usesDashboardFlow()).toBe(true);
    expect(shop.dashboardPinHash).toBe("pin-hash");
    expect(shop.mpAccessToken).toBe("AT-xxx");
    expect(shop.mpRefreshToken).toBe("RT-yyy");
    expect(shop.mpTokenExpiresAt).toBe("2026-10-29T12:00:00.000Z");
    expect(shop.mpUserId).toBe("mp-user-1");
    expect(shop.mpPublicKey).toBe("PK-zzz");
    expect(shop.connectedAt).toBe("2026-09-29T12:00:00.000Z");
  });

  it("maps a domain Shop back to a persistence insert", () => {
    const shop = shopMapper.toDomain(row);

    expect(shopMapper.toPersistence(shop)).toEqual({
      shop_name: row.shop_name,
      address: row.address,
      delivery_price: row.delivery_price,
      whatsapp_phone: row.whatsapp_phone,
      display_name: row.display_name,
      logo_url: row.logo_url,
      portrait_url: row.portrait_url,
      open_hours: row.open_hours,
      lat: row.lat,
      lng: row.lng,
      price_per_km: row.price_per_km,
      order_flow: row.order_flow,
      dashboard_pin_hash: row.dashboard_pin_hash,
      mp_access_token: row.mp_access_token,
      mp_refresh_token: row.mp_refresh_token,
      mp_token_expires_at: row.mp_token_expires_at,
      mp_user_id: row.mp_user_id,
      mp_public_key: row.mp_public_key,
      connected_at: row.connected_at,
      created_at: CREATED_AT,
      updated_at: UPDATED_AT,
    });
  });

  it("round-trips a connected dashboard shop through persistence without loss", () => {
    const connectedRow: ShopRow = {
      ...row,
      order_flow: "dashboard",
      dashboard_pin_hash: "pin-hash",
      mp_access_token: "AT-xxx",
      mp_refresh_token: "RT-yyy",
      mp_user_id: "mp-user-1",
      connected_at: "2026-09-29T12:00:00.000Z",
    };
    const shop = shopMapper.toDomain(connectedRow);

    const inserted = shopMapper.toPersistence(shop);
    // toPersistence omits id (the database generates it), so restore against
    // the original row with the insert fields overriding it.
    const restored = shopMapper.toDomain({ ...connectedRow, ...inserted });

    expect(restored.toObject()).toEqual(shop.toObject());
  });
});
