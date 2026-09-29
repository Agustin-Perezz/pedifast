import { describe, expect, it, vi } from "vitest";
import { makeShop } from "@/domain/entities/testing/shop.factory";
import type {
  MpTokensUpdate,
  UpdateShopMpTokensRepository,
} from "./update-shop-mp-tokens.repository.interface";
import { UpdateShopMpTokensUseCase } from "./update-shop-mp-tokens.use-case";

const SHOP_NAME = "pizzeria-luca";
const CONNECTED_AT = "2026-09-29T12:00:00.000Z";

const tokenUpdate: MpTokensUpdate = {
  mpAccessToken: "AT-xxx",
  mpRefreshToken: "RT-yyy",
  mpTokenExpiresAt: "2026-10-29T12:00:00.000Z",
  mpUserId: "mp-user-1",
  mpPublicKey: "PK-zzz",
  connectedAt: CONNECTED_AT,
};

type UpdateByShopIdFn = (
  shopName: string,
  tokens: MpTokensUpdate,
) => Promise<ReturnType<typeof makeShop> | null>;

function makeRepository(updatedShop: ReturnType<typeof makeShop> | null): {
  repository: UpdateShopMpTokensRepository;
  updateByShopName: ReturnType<typeof vi.fn<UpdateByShopIdFn>>;
} {
  const updateByShopName = vi
    .fn<UpdateByShopIdFn>()
    .mockResolvedValue(updatedShop);
  const repository: UpdateShopMpTokensRepository = { updateByShopName };
  return { repository, updateByShopName };
}

describe("UpdateShopMpTokensUseCase", () => {
  it("maps the dto onto the token update and returns the refreshed shop", async () => {
    const shop = makeShop();
    const { repository, updateByShopName } = makeRepository(shop);
    const useCase = new UpdateShopMpTokensUseCase(repository);

    const result = await useCase.execute({
      shopName: SHOP_NAME,
      ...tokenUpdate,
    });

    expect(updateByShopName).toHaveBeenCalledTimes(1);
    expect(updateByShopName).toHaveBeenCalledWith(SHOP_NAME, tokenUpdate);
    expect(result.shop).toBe(shop);
  });

  it("returns null when no shop matches the given name", async () => {
    const { repository, updateByShopName } = makeRepository(null);
    const useCase = new UpdateShopMpTokensUseCase(repository);

    const result = await useCase.execute({
      shopName: SHOP_NAME,
      ...tokenUpdate,
    });

    expect(updateByShopName).toHaveBeenCalledWith(SHOP_NAME, tokenUpdate);
    expect(result.shop).toBeNull();
  });

  it("does not forward extra dto keys to the repository", async () => {
    const { repository, updateByShopName } = makeRepository(null);
    const useCase = new UpdateShopMpTokensUseCase(repository);

    await useCase.execute({
      shopName: SHOP_NAME,
      ...tokenUpdate,
    });

    const [, forwarded] = updateByShopName.mock.calls[0] as [
      string,
      MpTokensUpdate,
    ];
    expect(Object.keys(forwarded).sort()).toEqual(
      Object.keys(tokenUpdate).sort(),
    );
  });
});
