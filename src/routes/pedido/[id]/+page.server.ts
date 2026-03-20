import { PaymentMethod } from '$lib/schemas/order';
import { mpService } from '$lib/server/mp-client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
  const orderId = params.id;
  const statusParam =
    url.searchParams.get('status') ?? url.searchParams.get('collection_status');
  const paymentIdParam = url.searchParams.get('payment_id');

  if (statusParam === PaymentMethod.enum.efectivo) {
    return { verifiedStatus: PaymentMethod.enum.efectivo, paymentId: null };
  }

  if (!paymentIdParam) {
    return { verifiedStatus: 'pending', paymentId: null };
  }

  const lastDash = orderId.lastIndexOf('-');
  const shopName = lastDash > 0 ? orderId.substring(0, lastDash) : null;

  if (!shopName) {
    return { verifiedStatus: 'pending', paymentId: paymentIdParam };
  }

  try {
    const payment = await mpService.getPaymentStatus(shopName, paymentIdParam);

    if (payment.externalReference !== orderId) {
      console.error(
        `Payment external_reference mismatch: expected "${orderId}", got "${payment.externalReference}"`
      );
      return { verifiedStatus: 'pending', paymentId: paymentIdParam };
    }

    return {
      verifiedStatus: payment.status,
      paymentId: paymentIdParam
    };
  } catch (err) {
    console.error('MP payment verification error:', err);
    return { verifiedStatus: 'pending', paymentId: paymentIdParam };
  }
};
