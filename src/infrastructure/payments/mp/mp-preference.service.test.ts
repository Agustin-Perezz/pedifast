import { describe, expect, it, vi } from "vitest";
import type { MpPreferenceRequest } from "./interfaces";
import { MpPreferenceService } from "./mp-preference.service";

const createMock = vi.fn().mockResolvedValue({
  id: "pref-123",
  init_point: "https://mp.test/init",
});

vi.mock("mercadopago", () => {
  return {
    MercadoPagoConfig: class {},
    Preference: class {
      create = createMock;
    },
  };
});

async function createdBody(
  request: MpPreferenceRequest,
): Promise<Record<string, unknown>> {
  createMock.mockClear();
  const service = new MpPreferenceService();

  const result = await service.createWithSellerToken(
    "seller-token",
    request,
    "pizzeria-luca-1700000000000",
  );

  expect(result.initPoint).toBe("https://mp.test/init");
  expect(result.preferenceId).toBe("pref-123");
  expect(createMock).toHaveBeenCalledTimes(1);

  return createMock.mock.calls[0][0].body as Record<string, unknown>;
}

const baseRequest: MpPreferenceRequest = {
  shopName: "pizzeria-luca",
  items: [{ title: "Pizza", quantity: 2, unitPrice: 1500, currencyId: "ARS" }],
  nombre: "Agustin",
  notas: "sin aceitunas",
  deliveryMethod: "delivery",
  address: "San Martin 100",
  baseUrl: "https://shop.example.com",
};

describe("MpPreferenceService", () => {
  it("sets back_urls and auto_return on production base URLs", async () => {
    const body = await createdBody(baseRequest);

    expect(body.back_urls).toEqual({
      success: "https://shop.example.com/pedido/pizzeria-luca-1700000000000",
      failure: "https://shop.example.com/pedido/pizzeria-luca-1700000000000",
      pending: "https://shop.example.com/pedido/pizzeria-luca-1700000000000",
    });
    expect(body.auto_return).toBe("approved");
  });

  it("omits back_urls and auto_return on localhost", async () => {
    const body = await createdBody({
      ...baseRequest,
      baseUrl: "http://localhost:3000",
    });

    expect(body.back_urls).toBeUndefined();
    expect(body.auto_return).toBeUndefined();
  });

  it("maps items and metadata into the preference body", async () => {
    const body = await createdBody(baseRequest);

    expect(body.items).toEqual([
      { title: "Pizza", quantity: 2, unit_price: 1500, currency_id: "ARS" },
    ]);
    expect(body.metadata).toEqual({
      shop_name: "pizzeria-luca",
      nombre: "Agustin",
      notas: "sin aceitunas",
      delivery_method: "delivery",
      address: "San Martin 100",
    });
    expect(body.external_reference).toBe("pizzeria-luca-1700000000000");
  });
});
