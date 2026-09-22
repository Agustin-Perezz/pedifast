import { Order } from "@/domain/entities/order.entity";
import type { CreateOrderRepository } from "./create-order.repository.interface";
import type { CreateOrderRequestDto } from "./create-order.request.dto";
import type { CreateOrderResponseDto } from "./create-order.response.dto";

export class CreateOrderUseCase {
  constructor(private readonly repository: CreateOrderRepository) {}

  async execute(dto: CreateOrderRequestDto): Promise<CreateOrderResponseDto> {
    const order = Order.create(dto);
    const saved = await this.repository.create(order);
    return { order: saved };
  }
}
