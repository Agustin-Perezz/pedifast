import type { SupabaseClient } from '@supabase/supabase-js';

import type { OrderStatusValue } from '$lib/schemas/order';
import type { OrderInsert } from '$lib/types/order';

export class OrdersRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async insert(order: OrderInsert) {
    const { data, error } = await this.supabase
      .from('orders')
      .insert(order)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to insert order: ${error?.message}`);
    }

    return data;
  }

  async getByShopId(shopId: number, status?: OrderStatusValue) {
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

    return data ?? [];
  }

  async getByExternalReference(externalReference: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('external_reference', externalReference)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  }

  async updateStatus(orderId: number, status: OrderStatusValue) {
    const { data, error } = await this.supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to update order status: ${error?.message}`);
    }

    return data;
  }

  async updatePaymentStatus(externalReference: string, paymentStatus: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('external_reference', externalReference)
      .select()
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  }
}
