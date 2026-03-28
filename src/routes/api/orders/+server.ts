import { json } from '@sveltejs/kit';
import { z } from 'zod';

import { DeliveryMethod, OrderFlow, PaymentMethod } from '$lib/schemas/order';

const createOrderSchema = z.object({
  shopName: z.string().min(1),
  externalReference: z.string().min(1),
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  notes: z.string().optional(),
  deliveryMethod: DeliveryMethod,
  address: z.string().optional(),
  paymentMethod: PaymentMethod,
  paymentStatus: z.string().optional(),
  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
      accessories: z
        .array(z.object({ name: z.string(), priceDelta: z.number() }))
        .optional()
    })
  ),
  total: z.number(),
  deliveryCost: z.number().optional()
});

export async function POST({
  request,
  locals
}: {
  request: Request;
  locals: App.Locals;
}) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { shopName, ...data } = parsed.data;

    const shopMeta = await locals.shopsService.getShopMeta(shopName);
    if (!shopMeta) {
      return json({ error: 'Shop not found' }, { status: 404 });
    }

    if (shopMeta.order_flow !== OrderFlow.enum.dashboard) {
      return json(
        { error: 'This shop does not use the dashboard order flow' },
        { status: 400 }
      );
    }

    const order = await locals.ordersService.createOrder(shopName, data);

    return json({
      orderId: order.id,
      externalReference: order.externalReference
    });
  } catch (err) {
    console.error('Error creating order:', err);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
