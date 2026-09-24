import { MercadoPagoConfig, Preference } from "mercadopago";

import type {
  MpPreferenceClient,
  MpPreferenceRequest,
  MpPreferenceResult,
} from "./interfaces";

const APPROVED_AUTO_RETURN = "approved";

function isLocalhost(baseUrl: string): boolean {
  return baseUrl.includes("localhost");
}

export class MpPreferenceService implements MpPreferenceClient {
  async createWithSellerToken(
    sellerAccessToken: string,
    request: MpPreferenceRequest,
    externalReference: string,
  ): Promise<MpPreferenceResult> {
    const config = new MercadoPagoConfig({ accessToken: sellerAccessToken });
    const resultUrl = `${request.baseUrl}/pedido/${externalReference}`;

    const body: Record<string, unknown> = {
      items: request.items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        currency_id: item.currencyId,
      })),
      external_reference: externalReference,
      metadata: {
        shop_name: request.shopName,
        nombre: request.nombre,
        notas: request.notas,
        delivery_method: request.deliveryMethod,
        address: request.address,
      },
    };

    if (!isLocalhost(request.baseUrl)) {
      body.back_urls = {
        success: resultUrl,
        failure: resultUrl,
        pending: resultUrl,
      };
      body.auto_return = APPROVED_AUTO_RETURN;
    }

    const preference = await new Preference(config).create({
      // SDK body is a broad record type; our shape is validated above.
      body: body as never,
    });

    return {
      initPoint: preference.init_point ?? "",
      preferenceId: preference.id ?? "",
      externalReference,
    };
  }
}
