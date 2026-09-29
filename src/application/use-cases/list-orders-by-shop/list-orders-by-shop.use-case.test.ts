import { describe, expect, it, vi } from "vitest";
import { OrderStatus } from "@/domain/entities/order-status.enum";
import { makeOrder } from "../testing/order.factory";
import type { ListOrdersByShopRepository } from "./list-orders-by-shop.repository.interface";
import { ListOrdersByShopUseCase } from "./list-orders-by-shop.use-case";

const SHOP_ID = 2;

type FindByShopIdFn = (
  shopId: number,
  status?: OrderStatus,
) => Promise<ReturnType<typeof makeOrder>[]>;

function makeRepository(orders: ReturnType<typeof makeOrder>[]): {
  repository: ListOrdersByShopRepository;
  findByShopId: ReturnType<typeof vi.fn<FindByShopIdFn>>;
} {
  const findByShopId = vi.fn<FindByShopIdFn>().mockResolvedValue(orders);
  const repository: ListOrdersByShopRepository = { findByShopId };
  return { repository, findByShopId };
}

describe("ListOrdersByShopUseCase", () => {
  it("delegates shop id and status filter to the repository and returns its orders", async () => {
    const orders = [
      makeOrder({ id: 1, shopId: SHOP_ID }),
      makeOrder({ id: 2, shopId: SHOP_ID, status: OrderStatus.Confirmed }),
    ];
    const { repository, findByShopId } = makeRepository(orders);
    const useCase = new ListOrdersByShopUseCase(repository);

    const result = await useCase.execute({
      shopId: SHOP_ID,
      status: OrderStatus.Pending,
    });

    expect(findByShopId).toHaveBeenCalledTimes(1);
    expect(findByShopId).toHaveBeenCalledWith(SHOP_ID, OrderStatus.Pending);
    expect(result.orders).toBe(orders);
    expect(result.orders.map((order) => order.id)).toEqual([1, 2]);
  });

  it("passes undefined when no status filter is provided", async () => {
    const { repository, findByShopId } = makeRepository([]);
    const useCase = new ListOrdersByShopUseCase(repository);

    const result = await useCase.execute({ shopId: SHOP_ID });

    expect(findByShopId).toHaveBeenCalledWith(SHOP_ID, undefined);
    expect(result.orders).toEqual([]);
  });
});
