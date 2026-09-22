import type { SupabaseClient } from "@supabase/supabase-js";
import type { UpdateOrderPaymentStatusRepository } from "@/application/use-cases/update-order-payment-status/update-order-payment-status.repository.interface";
import type { Order } from "@/domain/entities/order.entity";
import type { PaymentStatus } from "@/domain/entities/payment-status.enum";
import type { Database } from "../../database.types";
import { orderMapper } from "../../mappers/order.mapper";

export class SupabaseUpdateOrderPaymentStatusRepository
  implements UpdateOrderPaymentStatusRepository
{
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async updateByExternalReference(
    externalReference: string,
    paymentStatus: PaymentStatus,
  ): Promise<Order | null> {
    const { data, error } = await this.supabase
      .from("orders")
      .update({ payment_status: paymentStatus })
      .eq("external_reference", externalReference)
      .select()
      .single();

    if (error || !data) {
      return null;
    }

    return orderMapper.toDomain(data);
  }
}
