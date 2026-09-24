export type ShopPanelCredentials = {
  readonly id: number;
  readonly shopName: string;
  readonly dashboardPinHash: string | null;
};

export interface PanelAuthRepository {
  findPanelCredentialsByShopName(
    shopName: string,
  ): Promise<ShopPanelCredentials | null>;
}
