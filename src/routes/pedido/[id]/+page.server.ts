import { MercadoPagoPaymentStatus, PaymentMethod } from '$lib/schemas/order';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url, locals }) => {
  const orderId = params.id;
  const statusParam =
    url.searchParams.get('status') ?? url.searchParams.get('collection_status');
  const paymentIdParam = url.searchParams.get('payment_id');

  const dbOrder = await locals.ordersService.getByExternalReference(orderId);
  const isDashboardFlow = dbOrder !== null;

  if (statusParam === PaymentMethod.enum.efectivo) {
    return {
      verifiedStatus: PaymentMethod.enum.efectivo,
      paymentId: null,
      isDashboardFlow
    };
  }

  if (!paymentIdParam) {
    return { verifiedStatus: 'pending', paymentId: null, isDashboardFlow };
  }

  const lastDash = orderId.lastIndexOf('-');
  const shopName = lastDash > 0 ? orderId.substring(0, lastDash) : null;

  if (!shopName) {
    return {
      verifiedStatus: 'pending',
      paymentId: paymentIdParam,
      isDashboardFlow
    };
  }

  try {
    const payment = await locals.mpClient.getPaymentStatus(
      shopName,
      paymentIdParam
    );

    if (payment.externalReference !== orderId) {
      console.error(
        `Payment external_reference mismatch: expected "${orderId}", got "${payment.externalReference}"`
      );
      return {
        verifiedStatus: 'pending',
        paymentId: paymentIdParam,
        isDashboardFlow
      };
    }

    if (isDashboardFlow) {
      await locals.ordersService.updatePaymentStatus(
        orderId,
        payment.status ?? MercadoPagoPaymentStatus.pending
      );
    }

    return {
      verifiedStatus: payment.status,
      paymentId: paymentIdParam,
      isDashboardFlow
    };
  } catch (err) {
    console.error('MP payment verification error:', err);
    return {
      verifiedStatus: 'pending',
      paymentId: paymentIdParam,
      isDashboardFlow
    };
  }
};
