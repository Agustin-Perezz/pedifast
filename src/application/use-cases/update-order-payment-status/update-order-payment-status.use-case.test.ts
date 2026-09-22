import { describe, expect, it, vi } from "vitest";
import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import { Order } from "@/domain/entities/order.entity";
import { OrderStatus } from "@/domain/entities/order-status.enum";
import { PaymentMethod } from "@/domain/entities/payment-method.enum";
import { PaymentStatus } from "@/domain/entities/payment-status.enum";
import type { UpdateOrderPaymentStatusRepository } from "./update-order-payment-status.repository.interface";
import { UpdateOrderPaymentStatusUseCase } from "./update-order-payment-status.use-case";

function makeOrder(overrides: Partial<Order> = {}): Order {
  return Order.create({
    id: overrides.id ?? 1,
    shopId: overrides.shopId ?? 2,
    externalReference:
      overrides.externalReference ?? "pizzeria-luca-1700000000000",
    customerName: overrides.customerName ?? "Agustin",
    deliveryMethod:
      (overrides.deliveryMethod as DeliveryMethod | undefined) ??
      DeliveryMethod.Delivery,
    paymentMethod:
      (overrides.paymentMethod as PaymentMethod | undefined) ??
      PaymentMethod.Efectivo,
    paymentStatus:
      (overrides.paymentStatus as PaymentStatus | undefined) ??
      PaymentStatus.Approved,
    items: [
      ...(overrides.items ?? [
        { name: "Pizza", quantity: 1, unitPrice: 1500, accessories: [] },
      ]),
    ],
    total: overrides.total ?? 1500,
    deliveryCost: overrides.deliveryCost ?? 0,
    status: overrides.status ?? OrderStatus.Pending,
    createdAt: overrides.createdAt ?? "2026-01-01T00:00:00.000Z",
    updatedAt: overrides.updatedAt ?? "2026-01-01T00:00:00.000Z",
  });
}

describe("UpdateOrderPaymentStatusUseCase", () => {
  it("forwards the payment status update to the repository", async () => {
    const updatedOrder = makeOrder({ paymentStatus: PaymentStatus.Approved });
    const updateByExternalReference = vi.fn().mockResolvedValue(updatedOrder);
    const repository: UpdateOrderPaymentStatusRepository = {
      updateByExternalReference,
    };
    const useCase = new UpdateOrderPaymentStatusUseCase(repository);

    const result = await useCase.execute({
      externalReference: "pizzeria-luca-1700000000000",
      paymentStatus: PaymentStatus.Approved,
    });

    expect(updateByExternalReference).toHaveBeenCalledWith(
      "pizzeria-luca-1700000000000",
      PaymentStatus.Approved,
    );
    expect(result.order).toEqual(updatedOrder);
  });
});
