import type { Shop } from "@/domain/entities/shop.entity";

export type ShopMpTokens = {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: string;
};

export interface GetShopMpTokensRepository {
  findMpTokensByShopName(shopName: string): Promise<ShopMpTokens | null>;
}

export interface RefreshMpTokensRepository {
  updateRefreshedTokens(
    shopName: string,
    tokens: ShopMpTokens,
  ): Promise<Shop | null>;
}

export type { Shop };
