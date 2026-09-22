import type { GetOrderRepository } from "./get-order.repository.interface";
import type { GetOrderRequestDto } from "./get-order.request.dto";
import type { GetOrderResponseDto } from "./get-order.response.dto";

export class GetOrderUseCase {
  constructor(private readonly repository: GetOrderRepository) {}

  async execute(dto: GetOrderRequestDto): Promise<GetOrderResponseDto> {
    const order = await this.repository.findByExternalReference(
      dto.externalReference,
    );
    return { order };
  }
}
