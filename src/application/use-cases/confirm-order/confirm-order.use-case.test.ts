import { describe, expect, it, vi } from "vitest";
import type { Order } from "@/domain/entities/order.entity";
import { OrderStatus } from "@/domain/entities/order-status.enum";
import { OrderNotOwnedByShopError } from "@/domain/entities/panel-auth.error";
import { makeOrder } from "../testing/order.factory";
import type { ConfirmOrderRepository } from "./confirm-order.repository.interface";
import { ConfirmOrderUseCase } from "./confirm-order.use-case";

function makeRepository(orders: Order[]): {
  repository: ConfirmOrderRepository;
  updateStatus: ReturnType<typeof vi.fn>;
} {
  const findByShopId = vi
    .fn()
    .mockImplementation((shopId: number) =>
      Promise.resolve(orders.filter((order) => order.shopId === shopId)),
    );
  const updateStatus = vi
    .fn()
    .mockImplementation((orderId: number) =>
      Promise.resolve(
        makeOrder({ id: orderId, status: OrderStatus.Confirmed }),
      ),
    );

  return {
    repository: { findByShopId, updateStatus },
    updateStatus,
  };
}

describe("ConfirmOrderUseCase", () => {
  it("confirms a pending order belonging to the shop", async () => {
    const pending = makeOrder({
      id: 10,
      shopId: 7,
      status: OrderStatus.Pending,
    });
    const { repository, updateStatus } = makeRepository([pending]);
    const useCase = new ConfirmOrderUseCase(repository);

    const result = await useCase.execute({ orderId: 10, shopId: 7 });

    expect(updateStatus).toHaveBeenCalledWith(10, OrderStatus.Confirmed);
    expect(result.order.status).toBe(OrderStatus.Confirmed);
  });

  it("rejects a cross-shop order without changing any order", async () => {
    const otherShopOrder = makeOrder({ id: 10, shopId: 99 });
    const { repository, updateStatus } = makeRepository([otherShopOrder]);
    const useCase = new ConfirmOrderUseCase(repository);

    await expect(useCase.execute({ orderId: 10, shopId: 7 })).rejects.toThrow(
      OrderNotOwnedByShopError,
    );

    expect(updateStatus).not.toHaveBeenCalled();
  });

  it("rejects an order id that does not exist", async () => {
    const { repository, updateStatus } = makeRepository([]);
    const useCase = new ConfirmOrderUseCase(repository);

    await expect(useCase.execute({ orderId: 999, shopId: 7 })).rejects.toThrow(
      OrderNotOwnedByShopError,
    );

    expect(updateStatus).not.toHaveBeenCalled();
  });
});
