import type { SupabaseClient } from "@supabase/supabase-js";
import type { GetOrderRepository } from "@/application/use-cases/get-order/get-order.repository.interface";
import type { Order } from "@/domain/entities/order.entity";
import type { Database } from "../../database.types";
import { orderMapper } from "../../mappers/order.mapper";

export class SupabaseGetOrderRepository implements GetOrderRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findByExternalReference(
    externalReference: string,
  ): Promise<Order | null> {
    const { data, error } = await this.supabase
      .from("orders")
      .select("*")
      .eq("external_reference", externalReference)
      .single();

    if (error || !data) {
      return null;
    }

    return orderMapper.toDomain(data);
  }
}
