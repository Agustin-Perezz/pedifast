import type { Database } from "../database.types";

export type AccessoryGroupRow =
  Database["public"]["Tables"]["accessory_groups"]["Row"];
export type AccessoryGroupInsert =
  Database["public"]["Tables"]["accessory_groups"]["Insert"];
export type AccessoryGroupUpdate =
  Database["public"]["Tables"]["accessory_groups"]["Update"];
