import { OrderStatus } from "@/domain/entities/order-status.enum";
import { OrderNotOwnedByShopError } from "@/domain/entities/panel-auth.error";
import type { ConfirmOrderRepository } from "./confirm-order.repository.interface";
import type { ConfirmOrderRequestDto } from "./confirm-order.request.dto";
import type { ConfirmOrderResponseDto } from "./confirm-order.response.dto";

export class ConfirmOrderUseCase {
  constructor(private readonly repository: ConfirmOrderRepository) {}

  async execute(dto: ConfirmOrderRequestDto): Promise<ConfirmOrderResponseDto> {
    const order = await this.repository.updateStatusForShop(
      dto.orderId,
      dto.shopId,
      OrderStatus.Confirmed,
    );

    if (!order) {
      throw new OrderNotOwnedByShopError();
    }

    return { order };
  }
}
