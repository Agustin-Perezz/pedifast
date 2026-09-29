import { describe, expect, it, vi } from "vitest";
import { AccessoryGroup } from "@/domain/entities/accessory-group.entity";
import type { AccessoryGroupWithOptions } from "@/domain/entities/accessory-group-with-options";
import { AccessoryOption } from "@/domain/entities/accessory-option.entity";
import { AccessorySelectionMode } from "@/domain/entities/accessory-selection-mode.enum";
import type { GetAccessoryGroupsByItemIdsRepository } from "./get-accessory-groups-by-item-ids.repository.interface";
import { GetAccessoryGroupsByItemIdsUseCase } from "./get-accessory-groups-by-item-ids.use-case";

const PIZZA_ITEM_ID = 11;
const EMPANADAS_ITEM_ID = 22;
const UNKNOWN_ITEM_ID = 99;
const GROUP_ID = 5;
const OPTION_ID = 7;

function makeGroup(): AccessoryGroup {
  return AccessoryGroup.create({
    id: GROUP_ID,
    shopItemId: PIZZA_ITEM_ID,
    name: "Tamaño",
    selectionMode: AccessorySelectionMode.Single,
    isRequired: true,
    sortOrder: 1,
  });
}

function makeOption(): AccessoryOption {
  return AccessoryOption.create({
    id: OPTION_ID,
    groupId: GROUP_ID,
    name: "Grande",
    priceDelta: 500,
    sortOrder: 1,
  });
}

type FindByItemIdsFn = (
  itemIds: number[],
) => Promise<Map<number, AccessoryGroupWithOptions[]>>;

function makeRepository(
  groupsByItemId: Map<number, AccessoryGroupWithOptions[]>,
): {
  repository: GetAccessoryGroupsByItemIdsRepository;
  findByItemIds: ReturnType<typeof vi.fn<FindByItemIdsFn>>;
} {
  const findByItemIds = vi
    .fn<FindByItemIdsFn>()
    .mockResolvedValue(groupsByItemId);
  const repository: GetAccessoryGroupsByItemIdsRepository = { findByItemIds };
  return { repository, findByItemIds };
}

describe("GetAccessoryGroupsByItemIdsUseCase", () => {
  it("delegates to the repository and returns the map keyed by item id", async () => {
    const option = makeOption();
    const groupsByItemId = new Map<number, AccessoryGroupWithOptions[]>([
      [PIZZA_ITEM_ID, [{ group: makeGroup(), options: [option] }]],
      [EMPANADAS_ITEM_ID, []],
    ]);
    const { repository, findByItemIds } = makeRepository(groupsByItemId);
    const useCase = new GetAccessoryGroupsByItemIdsUseCase(repository);

    const result = await useCase.execute({
      itemIds: [PIZZA_ITEM_ID, EMPANADAS_ITEM_ID, UNKNOWN_ITEM_ID],
    });

    expect(findByItemIds).toHaveBeenCalledTimes(1);
    expect(findByItemIds).toHaveBeenCalledWith([
      PIZZA_ITEM_ID,
      EMPANADAS_ITEM_ID,
      UNKNOWN_ITEM_ID,
    ]);
    expect(result.groupsByItemId).toBe(groupsByItemId);
    expect(result.groupsByItemId.get(PIZZA_ITEM_ID)).toHaveLength(1);
    expect(result.groupsByItemId.get(PIZZA_ITEM_ID)?.[0]?.group.name).toBe(
      "Tamaño",
    );
    expect(result.groupsByItemId.get(PIZZA_ITEM_ID)?.[0]?.options).toEqual([
      option,
    ]);
    expect(result.groupsByItemId.get(EMPANADAS_ITEM_ID)).toEqual([]);
    expect(result.groupsByItemId.get(UNKNOWN_ITEM_ID)).toBeUndefined();
  });

  it("returns an empty map when no item has accessory groups", async () => {
    const { repository } = makeRepository(new Map());
    const useCase = new GetAccessoryGroupsByItemIdsUseCase(repository);

    const result = await useCase.execute({ itemIds: [PIZZA_ITEM_ID] });

    expect(result.groupsByItemId.size).toBe(0);
  });
});
