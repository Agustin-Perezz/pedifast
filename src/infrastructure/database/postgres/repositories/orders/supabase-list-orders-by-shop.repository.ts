import type { SupabaseClient } from "@supabase/supabase-js";
import type { ListOrdersByShopRepository } from "@/application/use-cases/list-orders-by-shop/list-orders-by-shop.repository.interface";
import type { Order } from "@/domain/entities/order.entity";
import type { OrderStatus } from "@/domain/entities/order-status.enum";
import type { Database } from "../../database.types";
import { orderMapper } from "../../mappers/order.mapper";

export class SupabaseListOrdersByShopRepository
  implements ListOrdersByShopRepository
{
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findByShopId(shopId: number, status?: OrderStatus): Promise<Order[]> {
    let query = this.supabase
      .from("orders")
      .select("*")
      .eq("shop_id", shopId)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to list orders: ${error.message}`);
    }

    return (data ?? []).map((row) => orderMapper.toDomain(row));
  }
}
