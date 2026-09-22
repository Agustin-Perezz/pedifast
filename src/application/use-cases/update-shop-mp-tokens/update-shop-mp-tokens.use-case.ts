import type { UpdateShopMpTokensRepository } from "./update-shop-mp-tokens.repository.interface";
import type { UpdateShopMpTokensRequestDto } from "./update-shop-mp-tokens.request.dto";
import type { UpdateShopMpTokensResponseDto } from "./update-shop-mp-tokens.response.dto";

export class UpdateShopMpTokensUseCase {
  constructor(private readonly repository: UpdateShopMpTokensRepository) {}

  async execute(
    dto: UpdateShopMpTokensRequestDto,
  ): Promise<UpdateShopMpTokensResponseDto> {
    const shop = await this.repository.updateByShopName(dto.shopName, {
      mpAccessToken: dto.mpAccessToken,
      mpRefreshToken: dto.mpRefreshToken,
      mpTokenExpiresAt: dto.mpTokenExpiresAt,
      mpUserId: dto.mpUserId,
      mpPublicKey: dto.mpPublicKey,
      connectedAt: dto.connectedAt,
    });
    return { shop };
  }
}
