import type { SupabaseClient } from '@supabase/supabase-js';
import { OrderMapper } from '$domain/mappers/order.mapper';
import type { Order, OrderInsert } from '$domain/models/order';
import type { Database } from '$domain/types/database.types';

import type { OrderStatusValue } from '$lib/schemas/order';

type OrderDbInsert = Database['public']['Tables']['orders']['Insert'];

export class OrdersRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async insert(order: OrderInsert): Promise<Order> {
    const { data, error } = await this.supabase
      .from('orders')
      .insert(order as unknown as OrderDbInsert)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to insert order: ${error?.message}`);
    }

    return OrderMapper.fromEntityToOrder(data);
  }

  async getByShopId(
    shopId: number,
    status?: OrderStatusValue
  ): Promise<Order[]> {
    let query = this.supabase
      .from('orders')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }

    return OrderMapper.fromEntitiesToOrders(data ?? []);
  }

  async getByExternalReference(
    externalReference: string
  ): Promise<Order | null> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('external_reference', externalReference)
      .single();

    if (error || !data) {
      return null;
    }

    return OrderMapper.fromEntityToOrder(data);
  }

  async updateStatus(
    orderId: number,
    status: OrderStatusValue
  ): Promise<Order> {
    const { data, error } = await this.supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update order status: ${error?.message}`);
    }

    return OrderMapper.fromEntityToOrder(data);
  }

  async updatePaymentStatus(
    externalReference: string,
    paymentStatus: string
  ): Promise<Order | null> {
    const { data, error } = await this.supabase
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('external_reference', externalReference)
      .select()
      .single();

    if (error || !data) {
      return null;
    }

    return OrderMapper.fromEntityToOrder(data);
  }
}
