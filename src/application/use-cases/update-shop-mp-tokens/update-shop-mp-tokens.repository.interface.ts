import type { Shop } from "@/domain/entities/shop.entity";

export type MpTokensUpdate = {
  readonly mpAccessToken: string;
  readonly mpRefreshToken: string;
  readonly mpTokenExpiresAt: string;
  readonly mpUserId: string;
  readonly mpPublicKey: string;
  readonly connectedAt: string;
};

export interface UpdateShopMpTokensRepository {
  updateByShopName(
    shopName: string,
    tokens: MpTokensUpdate,
  ): Promise<Shop | null>;
}
