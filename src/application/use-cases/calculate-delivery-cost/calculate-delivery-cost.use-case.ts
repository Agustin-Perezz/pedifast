import { InvalidOrderError } from "@/domain/entities/errors";
import type { DistanceMatrixProvider } from "./calculate-delivery-cost.repository.interface";
import {
  type CalculateDeliveryCostRequestDto,
  calculateDeliveryCostRequestDto,
} from "./calculate-delivery-cost.request.dto";
import type { CalculateDeliveryCostResponseDto } from "./calculate-delivery-cost.response.dto";

export class CalculateDeliveryCostUseCase {
  constructor(private readonly provider: DistanceMatrixProvider) {}

  async execute(
    dto: CalculateDeliveryCostRequestDto,
  ): Promise<CalculateDeliveryCostResponseDto> {
    const parsed = calculateDeliveryCostRequestDto.safeParse(dto);

    if (!parsed.success) {
      throw new InvalidOrderError(
        `Invalid delivery-cost request: ${parsed.error.issues.map((issue) => issue.message).join(", ")}`,
      );
    }

    const { originLat, originLng, destLat, destLng, pricePerKm } = parsed.data;

    const distance = await this.provider.computeDistance(
      { lat: originLat, lng: originLng },
      { lat: destLat, lng: destLng },
    );

    const shippingCost = Math.round(distance.distanceKm * pricePerKm);

    return {
      distanceMeters: distance.distanceMeters,
      distanceKm: Number(distance.distanceKm.toFixed(2)),
      shippingCost,
    };
  }
}
