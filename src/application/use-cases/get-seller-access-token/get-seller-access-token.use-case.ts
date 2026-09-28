import type { ShopMpTokens } from "./get-seller-access-token.repository.interface";
import type { GetSellerAccessTokenRequestDto } from "./get-seller-access-token.request.dto";
import type { GetSellerAccessTokenResponseDto } from "./get-seller-access-token.response.dto";

export interface MpTokenRefresher {
  refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }>;
}

export class ShopNotConnectedToMpError extends Error {
  constructor(shopName: string) {
    super(`Shop "${shopName}" is not connected to Mercado Pago`);
    this.name = "ShopNotConnectedToMpError";
  }
}

export class GetSellerAccessTokenUseCase {
  private readonly expiryBufferMs: number;

  constructor(
    private readonly tokensRepository: {
      findMpTokensByShopName(shopName: string): Promise<ShopMpTokens | null>;
      updateRefreshedTokens(
        shopName: string,
        tokens: ShopMpTokens,
      ): Promise<unknown>;
    },
    private readonly refresher: MpTokenRefresher,
    expiryBufferMs: number,
  ) {
    this.expiryBufferMs = expiryBufferMs;
  }

  async execute(
    dto: GetSellerAccessTokenRequestDto,
  ): Promise<GetSellerAccessTokenResponseDto> {
    const tokens = await this.tokensRepository.findMpTokensByShopName(
      dto.shopName,
    );

    if (!tokens) {
      throw new ShopNotConnectedToMpError(dto.shopName);
    }

    const expiresAt = new Date(tokens.expiresAt).getTime();

    if (Date.now() + this.expiryBufferMs < expiresAt) {
      return { accessToken: tokens.accessToken };
    }

    const refreshed = await this.refresher.refresh(tokens.refreshToken);
    const newTokens: ShopMpTokens = {
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken,
      expiresAt: new Date(
        Date.now() + refreshed.expiresIn * 1000,
      ).toISOString(),
    };

    await this.tokensRepository.updateRefreshedTokens(dto.shopName, newTokens);

    return { accessToken: newTokens.accessToken };
  }
}
