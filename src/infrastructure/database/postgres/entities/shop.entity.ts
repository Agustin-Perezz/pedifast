import type { Database } from "../database.types";

export type ShopRow = Database["public"]["Tables"]["shops"]["Row"];
export type ShopInsert = Database["public"]["Tables"]["shops"]["Insert"];
export type ShopUpdate = Database["public"]["Tables"]["shops"]["Update"];
