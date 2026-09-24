import { describe, expect, it, vi } from "vitest";
import type {
  PanelAuthRepository,
  ShopPanelCredentials,
} from "./panel-auth.repository.interface";
import type { PanelPinVerifier } from "./panel-auth.use-case";
import { PanelAuthUseCase } from "./panel-auth.use-case";

const STORED_HASH = "a1b2c3d4".repeat(8);

function makeRepository(
  credentials: ShopPanelCredentials | null,
): PanelAuthRepository {
  return {
    findPanelCredentialsByShopName: vi.fn().mockResolvedValue(credentials),
  };
}

function makeVerifier(valid: boolean): PanelPinVerifier {
  return { verify: vi.fn().mockReturnValue(valid) };
}

describe("PanelAuthUseCase", () => {
  it("issues a session payload for the correct PIN", async () => {
    const repository = makeRepository({
      id: 7,
      shopName: "pizzeria-luca",
      dashboardPinHash: STORED_HASH,
    });
    const useCase = new PanelAuthUseCase(repository, makeVerifier(true));

    const result = await useCase.execute({
      shopName: "pizzeria-luca",
      pin: "1234",
    });

    expect(result).toEqual({
      ok: true,
      shopId: 7,
      shopName: "pizzeria-luca",
    });
  });

  it("rejects a wrong PIN without leaking whether the shop exists", async () => {
    const repository = makeRepository({
      id: 7,
      shopName: "pizzeria-luca",
      dashboardPinHash: STORED_HASH,
    });
    const useCase = new PanelAuthUseCase(repository, makeVerifier(false));

    const result = await useCase.execute({
      shopName: "pizzeria-luca",
      pin: "9999",
    });

    expect(result).toEqual({ ok: false, reason: "INVALID_PIN" });
  });

  it("rejects login when the shop has no PIN hash (panel disabled)", async () => {
    const repository = makeRepository({
      id: 7,
      shopName: "pizzeria-luca",
      dashboardPinHash: null,
    });
    const verifier = makeVerifier(true);
    const useCase = new PanelAuthUseCase(repository, verifier);

    const result = await useCase.execute({
      shopName: "pizzeria-luca",
      pin: "1234",
    });

    expect(result).toEqual({ ok: false, reason: "PANEL_DISABLED" });
    expect(verifier.verify).not.toHaveBeenCalled();
  });

  it("rejects login when the shop does not exist", async () => {
    const repository = makeRepository(null);
    const useCase = new PanelAuthUseCase(repository, makeVerifier(true));

    const result = await useCase.execute({
      shopName: "ghost-shop",
      pin: "1234",
    });

    expect(result).toEqual({ ok: false, reason: "SHOP_NOT_FOUND" });
  });
});
