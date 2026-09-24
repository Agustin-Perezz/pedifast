import { OrderExternalReference } from "@/domain/entities/order-external-reference";
import type { CreateMpPreferenceRepository } from "./create-mp-preference.repository.interface";
import type { CreateMpPreferenceRequestDto } from "./create-mp-preference.request.dto";
import type { CreateMpPreferenceResponseDto } from "./create-mp-preference.response.dto";

export class CreateMpPreferenceUseCase {
  constructor(private readonly repository: CreateMpPreferenceRepository) {}

  async execute(
    dto: CreateMpPreferenceRequestDto,
  ): Promise<CreateMpPreferenceResponseDto> {
    const sellerAccessToken = await this.repository.getSellerAccessToken(
      dto.shopName,
    );

    const externalReference = OrderExternalReference.generate(
      dto.shopName,
    ).toReference();

    const result = await this.repository.createPreference(
      sellerAccessToken,
      dto,
      externalReference,
    );

    return {
      initPoint: result.initPoint,
      preferenceId: result.preferenceId,
      externalReference: result.externalReference,
    };
  }
}
