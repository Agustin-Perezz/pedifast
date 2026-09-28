import { InvalidOrderError } from "@/domain/entities/errors";
import type { GeocodeProvider } from "./geocode-address.repository.interface";
import {
  type GeocodeAddressRequestDto,
  geocodeAddressRequestDto,
} from "./geocode-address.request.dto";
import type { GeocodeAddressResponseDto } from "./geocode-address.response.dto";

export class GeocodeAddressUseCase {
  constructor(private readonly provider: GeocodeProvider) {}

  async execute(
    dto: GeocodeAddressRequestDto,
  ): Promise<GeocodeAddressResponseDto> {
    const parsed = geocodeAddressRequestDto.safeParse(dto);

    if (!parsed.success) {
      throw new InvalidOrderError(
        `Invalid geocode request: ${parsed.error.issues.map((issue) => issue.message).join(", ")}`,
      );
    }

    return this.provider.geocode(
      parsed.data.address,
      parsed.data.city,
      parsed.data.province,
    );
  }
}
