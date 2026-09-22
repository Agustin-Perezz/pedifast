import type { UpdateOrderStatusRepository } from "./update-order-status.repository.interface";
import type { UpdateOrderStatusRequestDto } from "./update-order-status.request.dto";
import type { UpdateOrderStatusResponseDto } from "./update-order-status.response.dto";

export class UpdateOrderStatusUseCase {
  constructor(private readonly repository: UpdateOrderStatusRepository) {}

  async execute(
    dto: UpdateOrderStatusRequestDto,
  ): Promise<UpdateOrderStatusResponseDto> {
    const order = await this.repository.updateStatus(dto.orderId, dto.status);
    return { order };
  }
}
