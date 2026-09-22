import { describe, expect, it, vi } from "vitest";
import { DeliveryMethod } from "@/domain/entities/delivery-method.enum";
import { Order } from "@/domain/entities/order.entity";
import { OrderStatus } from "@/domain/entities/order-status.enum";
import { PaymentMethod } from "@/domain/entities/payment-method.enum";
import { PaymentStatus } from "@/domain/entities/payment-status.enum";
import type { CreateOrderRepository } from "./create-order.repository.interface";
import { CreateOrderUseCase } from "./create-order.use-case";

describe("CreateOrderUseCase", () => {
  it("builds an Order from the DTO, persists it, and returns the saved order", async () => {
    const savedOrder = Order.create({
      id: 1,
      shopId: 2,
      externalReference: "pizzeria-luca-1700000000000",
      customerName: "Agustin",
      deliveryMethod: DeliveryMethod.Delivery,
      paymentMethod: PaymentMethod.Efectivo,
      paymentStatus: PaymentStatus.Approved,
      items: [{ name: "Pizza", quantity: 1, unitPrice: 1500, accessories: [] }],
      total: 1500,
      deliveryCost: 0,
      status: OrderStatus.Pending,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    const create = vi.fn().mockResolvedValue(savedOrder);
    const repository: CreateOrderRepository = { create };
    const useCase = new CreateOrderUseCase(repository);

    const result = await useCase.execute({
      shopId: 2,
      externalReference: "pizzeria-luca-1700000000000",
      customerName: "Agustin",
      customerPhone: null,
      notes: null,
      deliveryMethod: DeliveryMethod.Delivery,
      address: null,
      paymentMethod: PaymentMethod.Efectivo,
      paymentStatus: PaymentStatus.Approved,
      items: [{ name: "Pizza", quantity: 1, unitPrice: 1500, accessories: [] }],
      total: 1500,
      deliveryCost: 0,
    });

    expect(create).toHaveBeenCalledTimes(1);
    const [persisted] = create.mock.calls[0];
    expect(persisted).toBeInstanceOf(Order);
    expect(persisted.toObject()).toMatchObject({
      shopId: 2,
      externalReference: "pizzeria-luca-1700000000000",
      total: 1500,
    });
    expect(result).toEqual({ order: savedOrder });
  });
});
