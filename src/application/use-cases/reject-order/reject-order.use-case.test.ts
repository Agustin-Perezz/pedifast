import { describe, expect, it, vi } from "vitest";
import type { Order } from "@/domain/entities/order.entity";
import { OrderStatus } from "@/domain/entities/order-status.enum";
import { OrderNotOwnedByShopError } from "@/domain/entities/panel-auth.error";
import { makeOrder } from "../testing/order.factory";
import type { RejectOrderRepository } from "./reject-order.repository.interface";
import { RejectOrderUseCase } from "./reject-order.use-case";

type UpdateStatusForShopFn = (
  orderId: number,
  shopId: number,
  status: OrderStatus,
) => Promise<Order | null>;

function makeRepository(orderForShop: Order | null): {
  repository: RejectOrderRepository;
  updateStatusForShop: ReturnType<typeof vi.fn<UpdateStatusForShopFn>>;
} {
  const updateStatusForShop = vi
    .fn<UpdateStatusForShopFn>()
    .mockResolvedValue(orderForShop);
  const repository: RejectOrderRepository = { updateStatusForShop };
  return { repository, updateStatusForShop };
}

describe("RejectOrderUseCase", () => {
  it("rejects a pending order belonging to the shop", async () => {
    const rejected = makeOrder({
      id: 10,
      shopId: 7,
      status: OrderStatus.Rejected,
    });
    const { repository, updateStatusForShop } = makeRepository(rejected);
    const useCase = new RejectOrderUseCase(repository);

    const result = await useCase.execute({ orderId: 10, shopId: 7 });

    expect(updateStatusForShop).toHaveBeenCalledWith(
      10,
      7,
      OrderStatus.Rejected,
    );
    expect(result.order.status).toBe(OrderStatus.Rejected);
  });

  it("fails on a cross-shop order without changing any order", async () => {
    const { repository, updateStatusForShop } = makeRepository(null);
    const useCase = new RejectOrderUseCase(repository);

    await expect(useCase.execute({ orderId: 10, shopId: 7 })).rejects.toThrow(
      OrderNotOwnedByShopError,
    );

    expect(updateStatusForShop).toHaveBeenCalledTimes(1);
  });

  it("fails on an order id that does not exist", async () => {
    const { repository, updateStatusForShop } = makeRepository(null);
    const useCase = new RejectOrderUseCase(repository);

    await expect(useCase.execute({ orderId: 999, shopId: 7 })).rejects.toThrow(
      OrderNotOwnedByShopError,
    );

    expect(updateStatusForShop).toHaveBeenCalledTimes(1);
  });
});
