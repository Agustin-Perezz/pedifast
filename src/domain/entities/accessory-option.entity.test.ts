import { describe, expect, it } from "vitest";
import { AccessoryOption } from "./accessory-option.entity";
import { InvalidOrderError } from "./errors";

const CREATED_AT = "2026-01-01T00:00:00.000Z";
const UPDATED_AT = "2026-01-02T00:00:00.000Z";

function makeValidInput(): Parameters<typeof AccessoryOption.create>[0] {
  return {
    groupId: 5,
    name: "Grande",
    priceDelta: 0,
    sortOrder: 0,
  };
}

describe("AccessoryOption", () => {
  it("stamps fresh id and timestamps when not provided", () => {
    const before = new Date().toISOString();

    const option = AccessoryOption.create(makeValidInput());

    const after = new Date().toISOString();

    expect(option.id).toBe(0);
    expect(option.createdAt >= before).toBe(true);
    expect(option.createdAt <= after).toBe(true);
    expect(option.updatedAt >= before).toBe(true);
    expect(option.updatedAt <= after).toBe(true);
  });

  it("keeps explicit id, price delta and timestamps when provided", () => {
    const option = AccessoryOption.create({
      id: 7,
      groupId: 5,
      name: "Grande",
      priceDelta: 500,
      sortOrder: 2,
      createdAt: CREATED_AT,
      updatedAt: UPDATED_AT,
    });

    expect(option.id).toBe(7);
    expect(option.groupId).toBe(5);
    expect(option.priceDelta).toBe(500);
    expect(option.sortOrder).toBe(2);
    expect(option.createdAt).toBe(CREATED_AT);
    expect(option.updatedAt).toBe(UPDATED_AT);
  });

  it("rejects an empty name with a domain error", () => {
    expect(() =>
      AccessoryOption.create({ ...makeValidInput(), name: "" }),
    ).toThrow(InvalidOrderError);
  });

  it("rejects a non-positive group reference at the boundary", () => {
    expect(() =>
      AccessoryOption.create({ ...makeValidInput(), groupId: 0 }),
    ).toThrow(InvalidOrderError);
  });

  it("exposes an immutable copy of its props through toObject", () => {
    const option = AccessoryOption.create({
      ...makeValidInput(),
      priceDelta: 500,
    });

    const props = option.toObject();

    expect(props).toEqual({
      id: 0,
      groupId: 5,
      name: "Grande",
      priceDelta: 500,
      sortOrder: 0,
      createdAt: option.createdAt,
      updatedAt: option.updatedAt,
    });
    expect(props).not.toBe(option["props" as keyof AccessoryOption]);
  });
});
