import { OrderStatus } from "@/domain/entities/order-status.enum";
import { OrderNotOwnedByShopError } from "@/domain/entities/panel-auth.error";
import type { RejectOrderRepository } from "./reject-order.repository.interface";
import type { RejectOrderRequestDto } from "./reject-order.request.dto";
import type { RejectOrderResponseDto } from "./reject-order.response.dto";

export class RejectOrderUseCase {
  constructor(private readonly repository: RejectOrderRepository) {}

  async execute(dto: RejectOrderRequestDto): Promise<RejectOrderResponseDto> {
    const orders = await this.repository.findByShopId(dto.shopId);

    if (!orders.some((order) => order.id === dto.orderId)) {
      throw new OrderNotOwnedByShopError();
    }

    const order = await this.repository.updateStatus(
      dto.orderId,
      OrderStatus.Rejected,
    );

    return { order };
  }
}
