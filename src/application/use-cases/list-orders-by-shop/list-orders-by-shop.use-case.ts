import type { ListOrdersByShopRepository } from "./list-orders-by-shop.repository.interface";
import type { ListOrdersByShopRequestDto } from "./list-orders-by-shop.request.dto";
import type { ListOrdersByShopResponseDto } from "./list-orders-by-shop.response.dto";

export class ListOrdersByShopUseCase {
  constructor(private readonly repository: ListOrdersByShopRepository) {}

  async execute(
    dto: ListOrdersByShopRequestDto,
  ): Promise<ListOrdersByShopResponseDto> {
    const orders = await this.repository.findByShopId(dto.shopId, dto.status);
    return { orders };
  }
}
