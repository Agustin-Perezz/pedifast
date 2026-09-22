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
}
