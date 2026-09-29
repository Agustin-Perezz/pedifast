import { describe, expect, it } from "vitest";
import { AccessoryGroup } from "./accessory-group.entity";
import { AccessorySelectionMode } from "./accessory-selection-mode.enum";
import { InvalidOrderError } from "./errors";

const CREATED_AT = "2026-01-01T00:00:00.000Z";
const UPDATED_AT = "2026-01-02T00:00:00.000Z";

function makeValidInput(): Parameters<typeof AccessoryGroup.create>[0] {
  return {
    shopItemId: 11,
    name: "Tamaño",
    selectionMode: AccessorySelectionMode.Single,
    isRequired: false,
    sortOrder: 0,
  };
}

describe("AccessoryGroup", () => {
  it("stamps fresh id and timestamps when not provided", () => {
    const before = new Date().toISOString();

    const group = AccessoryGroup.create(makeValidInput());

    const after = new Date().toISOString();

    expect(group.id).toBe(0);
    expect(group.createdAt >= before).toBe(true);
    expect(group.createdAt <= after).toBe(true);
    expect(group.updatedAt >= before).toBe(true);
    expect(group.updatedAt <= after).toBe(true);
  });

  it("keeps explicit id, timestamps and sortOrder when provided", () => {
    const group = AccessoryGroup.create({
      id: 5,
      shopItemId: 11,
      name: "Extras",
      selectionMode: AccessorySelectionMode.Multi,
      isRequired: true,
      sortOrder: 3,
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    });

    expect(group.id).toBe(5);
    expect(group.shopItemId).toBe(11);
    expect(group.selectionMode).toBe(AccessorySelectionMode.Multi);
    expect(group.isRequired).toBe(true);
    expect(group.sortOrder).toBe(3);
    expect(group.createdAt).toBe(CREATED_AT);
    expect(group.updatedAt).toBe(UPDATED_AT);
  });

  it("rejects an empty name with a domain error naming the entity", () => {
    expect(() =>
      AccessoryGroup.create({
        ...makeValidInput(),
        name: "",
      }),
    ).toThrow(InvalidOrderError);
  });

  it("rejects an unknown selection mode at the boundary", () => {
    expect(() =>
      AccessoryGroup.create({
        ...makeValidInput(),
        selectionMode: "huge" as AccessorySelectionMode,
      }),
    ).toThrow(InvalidOrderError);
  });

  it("exposes an immutable copy of its props through toObject", () => {
    const group = AccessoryGroup.create({
      ...makeValidInput(),
      isRequired: true,
    });

    const props = group.toObject();

    expect(props).toEqual({
      id: 0,
      shopItemId: 11,
      name: "Tamaño",
      selectionMode: AccessorySelectionMode.Single,
      isRequired: true,
      sortOrder: 0,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    });
    expect(props).not.toBe(group["props" as keyof AccessoryGroup]);
  });
});
