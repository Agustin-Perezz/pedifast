import { describe, expect, it, vi } from "vitest";
import { InvalidOrderError } from "@/domain/entities/errors";
import type {
  DistanceMatrixProvider,
  DistanceResult,
} from "./calculate-delivery-cost.repository.interface";
import { CalculateDeliveryCostUseCase } from "./calculate-delivery-cost.use-case";

function makeProvider(result: DistanceResult): DistanceMatrixProvider {
  return {
    computeDistance: vi.fn().mockResolvedValue(result),
  };
}

describe("CalculateDeliveryCostUseCase", () => {
  it("calculates shipping cost rounded to nearest integer", async () => {
    const provider = makeProvider({ distanceMeters: 3200, distanceKm: 3.2 });
    const useCase = new CalculateDeliveryCostUseCase(provider);

    const result = await useCase.execute({
      originLat: -31.4489,
      originLng: -60.9316,
      destLat: -31.5,
      destLng: -61,
      pricePerKm: 500,
    });

    expect(result).toEqual({
      distanceMeters: 3200,
      distanceKm: 3.2,
      shippingCost: 1600,
    });
    expect(provider.computeDistance).toHaveBeenCalledWith(
      { lat: -31.4489, lng: -60.9316 },
      { lat: -31.5, lng: -61 },
    );
  });

  it("rejects missing coordinates", async () => {
    const provider = makeProvider({ distanceMeters: 0, distanceKm: 0 });
    const useCase = new CalculateDeliveryCostUseCase(provider);

    await expect(
      useCase.execute({
        originLat: NaN,
        originLng: -60.9316,
        destLat: -31.5,
        destLng: -61,
        pricePerKm: 500,
      }),
    ).rejects.toThrow(InvalidOrderError);
    expect(provider.computeDistance).not.toHaveBeenCalled();
  });

  it("rejects non-positive pricePerKm", async () => {
    const provider = makeProvider({ distanceMeters: 3200, distanceKm: 3.2 });
    const useCase = new CalculateDeliveryCostUseCase(provider);

    await expect(
      useCase.execute({
        originLat: -31.4489,
        originLng: -60.9316,
        destLat: -31.5,
        destLng: -61,
        pricePerKm: 0,
      }),
    ).rejects.toThrow(InvalidOrderError);
    expect(provider.computeDistance).not.toHaveBeenCalled();
  });

  it("rejects negative pricePerKm", async () => {
    const provider = makeProvider({ distanceMeters: 3200, distanceKm: 3.2 });
    const useCase = new CalculateDeliveryCostUseCase(provider);

    await expect(
      useCase.execute({
        originLat: -31.448,
        originLng: -60.9316,
        destLat: -31.5,
        destLng: -61,
        pricePerKm: -100,
      }),
    ).rejects.toThrow(InvalidOrderError);
    expect(provider.computeDistance).not.toHaveBeenCalled();
  });
});
