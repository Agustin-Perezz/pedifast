import { ShopNotFoundError } from "@/domain/entities/errors";
import type { GetShopCatalogRepository } from "./get-shop-catalog.repository.interface";
import type { GetShopCatalogRequestDto } from "./get-shop-catalog.request.dto";
import type { GetShopCatalogResponseDto } from "./get-shop-catalog.response.dto";

export class GetShopCatalogUseCase {
  constructor(private readonly repository: GetShopCatalogRepository) {}

  async execute(
    dto: GetShopCatalogRequestDto,
  ): Promise<GetShopCatalogResponseDto> {
    const catalog = await this.repository.findByShopName(dto.shopName);

    if (!catalog) {
      throw new ShopNotFoundError(dto.shopName);
    }

    return { catalog };
  }
}
