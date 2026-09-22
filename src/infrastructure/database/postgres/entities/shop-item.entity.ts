import type { Database } from "../database.types";

export type ShopItemRow = Database["public"]["Tables"]["shop_items"]["Row"];
export type ShopItemInsert =
  Database["public"]["Tables"]["shop_items"]["Insert"];
export type ShopItemUpdate =
  Database["public"]["Tables"]["shop_items"]["Update"];
