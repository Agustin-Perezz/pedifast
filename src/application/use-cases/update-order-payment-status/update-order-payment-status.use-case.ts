import type { UpdateOrderPaymentStatusRepository } from "./update-order-payment-status.repository.interface";
import type { UpdateOrderPaymentStatusRequestDto } from "./update-order-payment-status.request.dto";
import type { UpdateOrderPaymentStatusResponseDto } from "./update-order-payment-status.response.dto";

export class UpdateOrderPaymentStatusUseCase {
  constructor(
    private readonly repository: UpdateOrderPaymentStatusRepository,
  ) {}

  async execute(
    dto: UpdateOrderPaymentStatusRequestDto,
  ): Promise<UpdateOrderPaymentStatusResponseDto> {
    const order = await this.repository.updateByExternalReference(
      dto.externalReference,
      dto.paymentStatus,
    );
    return { order };
  }
}
