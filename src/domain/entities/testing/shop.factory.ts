import { OrderFlow } from "@/domain/entities/order-flow.enum";
import { Shop } from "@/domain/entities/shop.entity";

export type MakeShopInput = {
  readonly id?: number;
  readonly shopName?: string;
  readonly address?: string;
  readonly deliveryPrice?: number | null;
  readonly whatsappPhone?: string;
  readonly displayName?: string | null;
  readonly logoUrl?: string | null;
  readonly portraitUrl?: string | null;
  readonly openHours?: string | null;
  readonly lat?: number;
  readonly lng?: number;
  readonly pricePerKm?: number;
  readonly orderFlow?: OrderFlow;
  readonly dashboardPinHash?: string | null;
  readonly mpAccessToken?: string | null;
  readonly mpRefreshToken?: string | null;
  readonly mpTokenExpiresAt?: string | null;
  readonly mpUserId?: string | null;
  readonly mpPublicKey?: string | null;
  readonly connectedAt?: string | null;
  readonly createdAt?: string;
  readonly updatedAt?: string;
};

export function makeShop(input: MakeShopInput = {}): Shop {
  return Shop.create({
    id: input.id ?? 1,
    shopName: input.shopName ?? "pizzeria-luca",
    address: input.address ?? "Av. San Martin 123",
    deliveryPrice: input.deliveryPrice ?? null,
    whatsappPhone: input.whatsappPhone ?? "+5491234567890",
    displayName: input.displayName ?? null,
    logoUrl: input.logoUrl ?? null,
    portraitUrl: input.portraitUrl ?? null,
    openHours: input.openHours ?? null,
    lat: input.lat ?? -34.6037,
    lng: input.lng ?? -58.3816,
    pricePerKm: input.pricePerKm ?? 0,
    orderFlow: input.orderFlow ?? OrderFlow.Whatsapp,
    dashboardPinHash: input.dashboardPinHash ?? null,
    mpAccessToken: input.mpAccessToken ?? null,
    mpRefreshToken: input.mpRefreshToken ?? null,
    mpTokenExpiresAt: input.mpTokenExpiresAt ?? null,
    mpUserId: input.mpUserId ?? null,
    mpPublicKey: input.mpPublicKey ?? null,
    connectedAt: input.connectedAt ?? null,
    createdAt: input.createdAt ?? "2026-01-01T00:00:00.000Z",
    updatedAt: input.updatedAt ?? "2026-01-01T00:00:00.000Z",
  });
}
