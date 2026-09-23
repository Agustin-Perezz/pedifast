import { describe, expect, it, vi } from "vitest";
import { InvalidOrderError } from "@/domain/entities/errors";
import type {
  GeoCoordinates,
  GeocodeProvider,
} from "./geocode-address.repository.interface";
import { GeocodeAddressUseCase } from "./geocode-address.use-case";

function makeProvider(coords: GeoCoordinates): GeocodeProvider {
  return {
    geocode: vi.fn().mockResolvedValue(coords),
  };
}

describe("GeocodeAddressUseCase", () => {
  it("forwards the request to the provider and returns coordinates", async () => {
    const provider = makeProvider({ lat: -31.4489, lng: -60.9316 });
    const useCase = new GeocodeAddressUseCase(provider);

    const result = await useCase.execute({
      address: "San Martín 123",
      city: "Rosario",
      province: "Santa Fe",
    });

    expect(provider.geocode).toHaveBeenCalledWith(
      "San Martín 123",
      "Rosario",
      "Santa Fe",
    );
    expect(result).toEqual({ lat: -31.4489, lng: -60.9316 });
  });

  it("throws InvalidOrderError when address is empty", async () => {
    const provider = makeProvider({ lat: 0, lng: 0 });
    const useCase = new GeocodeAddressUseCase(provider);

    await expect(useCase.execute({ address: "" })).rejects.toThrow(
      InvalidOrderError,
    );
    expect(provider.geocode).not.toHaveBeenCalled();
  });

  it("passes undefined city/province to the provider when omitted", async () => {
    const provider = makeProvider({ lat: -31.4489, lng: -60.9316 });
    const useCase = new GeocodeAddressUseCase(provider);

    await useCase.execute({ address: "San Martín 123" });

    expect(provider.geocode).toHaveBeenCalledWith(
      "San Martín 123",
      undefined,
      undefined,
    );
  });
});
