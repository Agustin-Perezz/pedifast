import { describe, expect, it } from "vitest";
import { AccessorySelectionMode } from "@/domain/entities/accessory-selection-mode.enum";
import type { AccessoryGroupRow } from "../entities/accessory-group.entity";
import { accessoryGroupMapper } from "./accessory-group.mapper";

const row: AccessoryGroupRow = {
  id: 5,
  shop_item_id: 11,
  name: "Tamaño",
  selection_mode: "single",
  is_required: true,
  sort_order: 1,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

const timestamp = "2026-01-01T00:00:00.000Z";

describe("accessoryGroupMapper", () => {
  it("maps a persistence row to a domain AccessoryGroup with typed fields", () => {
    const group = accessoryGroupMapper.toDomain(row);

    expect(group.id).toBe(row.id);
    expect(group.shopItemId).toBe(row.shop_item_id);
    expect(group.name).toBe(row.name);
    expect(group.selectionMode).toBe(AccessorySelectionMode.Single);
    expect(group.isRequired).toBe(true);
    expect(group.sortOrder).toBe(row.sort_order);
    expect(group.createdAt).toBe(timestamp);
    expect(group.updatedAt).toBe(timestamp);
  });

  it("maps a domain AccessoryGroup back to a persistence insert", () => {
    const group = accessoryGroupMapper.toDomain(row);

    expect(accessoryGroupMapper.toPersistence(group)).toEqual({
      shop_item_id: row.shop_item_id,
      name: row.name,
      selection_mode: row.selection_mode,
      is_required: row.is_required,
      sort_order: row.sort_order,
      created_at: timestamp,
      updated_at: timestamp,
    });
  });

  it("round-trips a multi-select group through persistence without loss", () => {
    const group = accessoryGroupMapper.toDomain({
      ...row,
      selection_mode: "multi",
      is_required: false,
      sort_order: 3,
    });

    const inserted = accessoryGroupMapper.toPersistence(group);
    const restored = accessoryGroupMapper.toDomain({
      ...row,
      selection_mode: inserted.selection_mode,
      is_required: inserted.is_required ?? false,
      sort_order: inserted.sort_order ?? 0,
    });

    expect(restored.toObject()).toEqual(group.toObject());
  });
});
