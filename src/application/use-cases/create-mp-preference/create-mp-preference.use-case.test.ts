import { describe, expect, it, vi } from "vitest";
import { CreateMpPreferenceUseCase } from "./create-mp-preference.use-case";

function makeRepository() {
  return {
    getSellerAccessToken: vi.fn().mockResolvedValue("seller-token"),
    createPreference: vi
      .fn()
      .mockImplementation(
        (_token: string, request: unknown, externalReference: string) =>
          Promise.resolve({
            initPoint: "https://mp.test/init",
            preferenceId: "pref-123",
            externalReference,
            request,
          }),
      ),
  };
}

const baseRequest = {
  shopName: "pizzeria-luca",
  nombre: "Agustin",
  notas: "",
  deliveryMethod: "delivery" as const,
  address: "San Martin 100",
  items: [
    {
      title: "Pizza",
      quantity: 1,
      unitPrice: 1500,
      currencyId: "ARS" as const,
    },
  ],
  baseUrl: "https://shop.example.com",
};

describe("CreateMpPreferenceUseCase", () => {
  it("builds external_reference as shopName-timestamp and returns MP results", async () => {
    const repository = makeRepository();
    const useCase = new CreateMpPreferenceUseCase(repository);

    const before = Date.now();
    const result = await useCase.execute(baseRequest);
    const after = Date.now();

    const [token, request, externalReference] =
      repository.createPreference.mock.calls[0];

    expect(token).toBe("seller-token");
    expect(request).toEqual(baseRequest);
    expect(externalReference).toMatch(/^pizzeria-luca-\d+$/);
    const timestamp = Number(
      externalReference.slice(externalReference.lastIndexOf("-") + 1),
    );
    expect(timestamp).toBeGreaterThanOrEqual(before);
    expect(timestamp).toBeLessThanOrEqual(after);
    expect(result.externalReference).toBe(externalReference);
    expect(result.initPoint).toBe("https://mp.test/init");
    expect(result.preferenceId).toBe("pref-123");
  });
});
