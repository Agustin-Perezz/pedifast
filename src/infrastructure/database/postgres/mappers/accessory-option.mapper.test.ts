import { describe, expect, it } from "vitest";
import type { AccessoryOptionRow } from "../entities/accessory-option.entity";
import { accessoryOptionMapper } from "./accessory-option.mapper";

const row: AccessoryOptionRow = {
  id: 7,
  group_id: 5,
  name: "Grande",
  price_delta: 500,
  sort_order: 1,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

const timestamp = "2026-01-01T00:00:00.000Z";

describe("accessoryOptionMapper", () => {
  it("maps a persistence row to a domain AccessoryOption", () => {
    const option = accessoryOptionMapper.toDomain(row);

    expect(option.id).toBe(row.id);
    expect(option.groupId).toBe(row.group_id);
    expect(option.name).toBe(row.name);
    expect(option.priceDelta).toBe(row.price_delta);
    expect(option.sortOrder).toBe(row.sort_order);
    expect(option.createdAt).toBe(timestamp);
    expect(option.updatedAt).toBe(timestamp);
  });

  it("maps a domain AccessoryOption back to a persistence insert", () => {
    const option = accessoryOptionMapper.toDomain(row);

    expect(accessoryOptionMapper.toPersistence(option)).toEqual({
      group_id: row.group_id,
      name: row.name,
      price_delta: row.price_delta,
      sort_order: row.sort_order,
      created_at: timestamp,
      updated_at: timestamp,
    });
  });

  it("round-trips an option with zero price delta without loss", () => {
    const option = accessoryOptionMapper.toDomain({
      ...row,
      price_delta: 0,
      sort_order: 0,
    });

    const inserted = accessoryOptionMapper.toPersistence(option);
    const restored = accessoryOptionMapper.toDomain({
      ...row,
      price_delta: inserted.price_delta ?? 0,
      sort_order: inserted.sort_order ?? 0,
    });

    expect(restored.toObject()).toEqual(option.toObject());
  });
});
