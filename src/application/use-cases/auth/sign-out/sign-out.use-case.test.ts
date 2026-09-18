import { describe, expect, it, vi } from "vitest";
import type { ISignOutRepository } from "./sign-out.repository.interface";
import { SignOutUseCase } from "./sign-out.use-case";

describe("SignOutUseCase", () => {
  it("delegates to the repository", async () => {
    const repository: ISignOutRepository = {
      signOut: vi.fn().mockResolvedValue(undefined),
    };
    const useCase = new SignOutUseCase(repository);

    await useCase.execute();

    expect(repository.signOut).toHaveBeenCalledOnce();
  });

  it("resolves without a return value", async () => {
    const repository: ISignOutRepository = {
      signOut: vi.fn().mockResolvedValue(undefined),
    };
    const useCase = new SignOutUseCase(repository);

    await expect(useCase.execute()).resolves.toBeUndefined();
  });
});
