import { PaymentMethod } from '$lib/schemas/order';
import { MP_API_BASE_URL } from '$lib/server/env';
import { getSellerAccessToken } from '$lib/server/mp-token';
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
    const accessToken = await getSellerAccessToken(shopName);

    const mpResponse = await fetch(
      `${MP_API_BASE_URL}/v1/payments/${paymentIdParam}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    if (!mpResponse.ok) {
      console.error(
        `MP payment verification failed (${mpResponse.status}) for payment ${paymentIdParam}`
      );
      return { verifiedStatus: 'pending', paymentId: paymentIdParam };
    }

    const payment = await mpResponse.json();

    if (payment.external_reference !== orderId) {
      console.error(
        `Payment external_reference mismatch: expected "${orderId}", got "${payment.external_reference}"`
      );
      return { verifiedStatus: 'pending', paymentId: paymentIdParam };
    }

    return {
      verifiedStatus: payment.status as string,
      paymentId: paymentIdParam
    };
  } catch (err) {
    console.error('MP payment verification error:', err);
    return { verifiedStatus: 'pending', paymentId: paymentIdParam };
  }
};
