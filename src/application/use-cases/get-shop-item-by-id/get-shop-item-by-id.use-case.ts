import type { GetShopItemByIdRepository } from "./get-shop-item-by-id.repository.interface";
import type { GetShopItemByIdRequestDto } from "./get-shop-item-by-id.request.dto";
import type { GetShopItemByIdResponseDto } from "./get-shop-item-by-id.response.dto";

export class GetShopItemByIdUseCase {
  constructor(private readonly repository: GetShopItemByIdRepository) {}

  async execute(
    dto: GetShopItemByIdRequestDto,
  ): Promise<GetShopItemByIdResponseDto> {
    const shopItem = await this.repository.findById(dto.itemId);
    return { shopItem };
  }
}
