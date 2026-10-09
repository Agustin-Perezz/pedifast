import { PaymentMethod } from "@/domain/entities/payment-method.enum";
import { PaymentStatus } from "@/domain/entities/payment-status.enum";
import type { MpPaymentGateway } from "@/infrastructure/payments/mp/mp-payment-gateway.interface";
import type { VerifyMpPaymentRepository } from "./verify-mp-payment.repository.interface";
import type { VerifyMpPaymentRequestDto } from "./verify-mp-payment.request.dto";
import type { VerifyMpPaymentResponseDto } from "./verify-mp-payment.response.dto";

export class VerifyMpPaymentUseCase {
  constructor(
    private readonly repository: VerifyMpPaymentRepository,
    private readonly gateway: MpPaymentGateway,
  ) {}

  async execute(
    dto: VerifyMpPaymentRequestDto,
  ): Promise<VerifyMpPaymentResponseDto> {
    const dbOrder = await this.repository.findByExternalReference(dto.orderId);
    const isDashboardFlow = dbOrder !== null;

    if (dto.statusParam === PaymentMethod.Efectivo) {
      return {
        verifiedStatus: PaymentMethod.Efectivo,
        paymentId: null,
        isDashboardFlow,
      };
    }

    if (!dto.paymentIdParam) {
      return {
        verifiedStatus: PaymentStatus.Pending,
        paymentId: null,
        isDashboardFlow,
      };
    }

    const shopName = this.deriveShopName(dto.orderId);

    if (!shopName) {
      return {
        verifiedStatus: PaymentStatus.Pending,
        paymentId: dto.paymentIdParam,
        isDashboardFlow,
      };
    }

    try {
      const payment = await this.gateway.getPaymentStatus(
        shopName,
        dto.paymentIdParam,
      );

      if (payment.externalReference !== dto.orderId) {
        return {
          verifiedStatus: PaymentStatus.Pending,
          paymentId: dto.paymentIdParam,
          isDashboardFlow,
        };
      }

      const verifiedStatus = this.normalizeStatus(payment.status);

      if (isDashboardFlow) {
        await this.repository.updatePaymentStatus(
          dto.orderId,
          this.buildPersistedStatus(verifiedStatus),
        );
      }

      return {
        verifiedStatus,
        paymentId: dto.paymentIdParam,
        isDashboardFlow,
      };
    } catch {
      return {
        verifiedStatus: PaymentStatus.Pending,
        paymentId: dto.paymentIdParam,
        isDashboardFlow,
      };
    }
  }

  private deriveShopName(orderId: string): string | null {
    const lastDash = orderId.lastIndexOf("-");
    return lastDash > 0 ? orderId.slice(0, lastDash) : null;
  }

  private normalizeStatus(status: string): PaymentStatus {
    if (
      status === PaymentStatus.Approved ||
      status === PaymentStatus.Rejected
    ) {
      return status;
    }

    return PaymentStatus.Pending;
  }

  /**
   * Converts the response-DTO status into the `PaymentStatus` enum the
   * repository persists. The cash value has no persisted counterpart and
   * degrades to pending, matching the original ternary behavior for every
   * possible input.
   */
  private buildPersistedStatus(
    verifiedStatus: VerifyMpPaymentResponseDto["verifiedStatus"],
  ): PaymentStatus {
    if (verifiedStatus === PaymentStatus.Approved) {
      return PaymentStatus.Approved;
    }

    if (verifiedStatus === PaymentStatus.Rejected) {
      return PaymentStatus.Rejected;
    }

    return PaymentStatus.Pending;
  }
}
