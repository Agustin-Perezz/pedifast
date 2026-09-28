import { describe, expect, it, vi } from "vitest";
import type { ShopMpTokens } from "./get-seller-access-token.repository.interface";
import {
  GetSellerAccessTokenUseCase,
  ShopNotConnectedToMpError,
} from "./get-seller-access-token.use-case";

const ONE_HOUR_MS = 60 * 60 * 1000;

function makeTokens(overrides: Partial<ShopMpTokens> = {}): ShopMpTokens {
  return {
    accessToken: "stored-access-token",
    refreshToken: "stored-refresh-token",
    expiresAt: new Date(Date.now() + 3 * ONE_HOUR_MS).toISOString(),
    ...overrides,
  };
}

function makeUseCase(
  tokens: ShopMpTokens | null,
  options: {
    refreshToken?: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  } = {},
) {
  const findMpTokensByShopName = vi.fn().mockResolvedValue(tokens);
  const updateRefreshedTokens = vi.fn().mockResolvedValue({});
  const refresh = vi.fn().mockResolvedValue(
    options.refreshToken ?? {
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
      expiresIn: 21600,
    },
  );

  const useCase = new GetSellerAccessTokenUseCase(
    { findMpTokensByShopName, updateRefreshedTokens },
    { refresh },
    ONE_HOUR_MS,
  );

  return { useCase, refresh, updateRefreshedTokens };
}

describe("GetSellerAccessTokenUseCase", () => {
  it("returns the stored token when valid beyond the 1-hour buffer", async () => {
    const { useCase, refresh } = makeUseCase(makeTokens());

    const result = await useCase.execute({ shopName: "pizzeria-luca" });

    expect(result.accessToken).toBe("stored-access-token");
    expect(refresh).not.toHaveBeenCalled();
  });

  it("refreshes and persists when the token is within the buffer", async () => {
    const { useCase, refresh, updateRefreshedTokens } = makeUseCase(
      makeTokens({
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      }),
    );

    const result = await useCase.execute({ shopName: "pizzeria-luca" });

    expect(refresh).toHaveBeenCalledWith("stored-refresh-token");
    expect(result.accessToken).toBe("new-access-token");
    expect(updateRefreshedTokens).toHaveBeenCalledWith(
      "pizzeria-luca",
      expect.objectContaining({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      }),
    );
  });

  it("refreshes an already-expired token", async () => {
    const { useCase, refresh } = makeUseCase(
      makeTokens({ expiresAt: new Date(Date.now() - 1000).toISOString() }),
    );

    await useCase.execute({ shopName: "pizzeria-luca" });

    expect(refresh).toHaveBeenCalled();
  });

  it("errors when the shop has no stored MP tokens", async () => {
    const { useCase, refresh } = makeUseCase(null);

    await expect(
      useCase.execute({ shopName: "pizzeria-luca" }),
    ).rejects.toThrow(ShopNotConnectedToMpError);

    expect(refresh).not.toHaveBeenCalled();
  });
});
