import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreateOrderRepository } from "@/application/use-cases/create-order/create-order.repository.interface";
import type { Order } from "@/domain/entities/order.entity";
import type { Database } from "../../database.types";
import { orderMapper } from "../../mappers/order.mapper";

export class SupabaseCreateOrderRepository implements CreateOrderRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async create(order: Order): Promise<Order> {
    const insertPayload = orderMapper.toPersistence(order);

    const { data, error } = await this.supabase
      .from("orders")
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }

    return orderMapper.toDomain(data);
  }
}
