import type { GetAccessoryGroupsByItemIdsRepository } from "./get-accessory-groups-by-item-ids.repository.interface";
import type { GetAccessoryGroupsByItemIdsRequestDto } from "./get-accessory-groups-by-item-ids.request.dto";
import type { GetAccessoryGroupsByItemIdsResponseDto } from "./get-accessory-groups-by-item-ids.response.dto";

export class GetAccessoryGroupsByItemIdsUseCase {
  constructor(
    private readonly repository: GetAccessoryGroupsByItemIdsRepository,
  ) {}

  async execute(
    dto: GetAccessoryGroupsByItemIdsRequestDto,
  ): Promise<GetAccessoryGroupsByItemIdsResponseDto> {
    const groupsByItemId = await this.repository.findByItemIds(dto.itemIds);
    return { groupsByItemId };
  }
}
