import type { SupabaseClient } from "@supabase/supabase-js";
import type { UpdateOrderStatusRepository } from "@/application/use-cases/update-order-status/update-order-status.repository.interface";
import type { Order } from "@/domain/entities/order.entity";
import type { OrderStatus } from "@/domain/entities/order-status.enum";
import type { Database } from "../../database.types";
import { orderMapper } from "../../mappers/order.mapper";

export class SupabaseUpdateOrderStatusRepository
  implements UpdateOrderStatusRepository
{
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async updateStatus(orderId: number, status: OrderStatus): Promise<Order> {
    const { data, error } = await this.supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }

    return orderMapper.toDomain(data);
  }

  async updateStatusForShop(
    orderId: number,
    shopId: number,
    status: OrderStatus,
  ): Promise<Order | null> {
    const { data, error } = await this.supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .eq("shop_id", shopId)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }

    return data ? orderMapper.toDomain(data) : null;
  }
}
