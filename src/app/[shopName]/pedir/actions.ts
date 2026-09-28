"use server";

import { calculateDeliveryCostRequestDto } from "@/application/use-cases/calculate-delivery-cost/calculate-delivery-cost.request.dto";
import { CalculateDeliveryCostUseCase } from "@/application/use-cases/calculate-delivery-cost/calculate-delivery-cost.use-case";
import { createOrderRequestDto } from "@/application/use-cases/create-order/create-order.request.dto";
import { CreateOrderUseCase } from "@/application/use-cases/create-order/create-order.use-case";
import { geocodeAddressRequestDto } from "@/application/use-cases/geocode-address/geocode-address.request.dto";
import { GeocodeAddressUseCase } from "@/application/use-cases/geocode-address/geocode-address.use-case";
import { DomainError } from "@/domain/entities/errors";
import { SupabaseCreateOrderRepository } from "@/infrastructure/database/postgres/repositories/orders/supabase-create-order.repository";
import { GoogleDistanceMatrixService } from "@/infrastructure/geo/google-distance-matrix.service";
import { GoogleGeocodeService } from "@/infrastructure/geo/google-geocode.service";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

import { getShopOrderFlow } from "./queries";

const SHOP_FLOW_MISMATCH_CODE = "SHOP_FLOW_MISMATCH";

export type GeocodeActionResult =
  | { ok: true; lat: number; lng: number }
  | { ok: false; error: string };

export type DeliveryCostActionResult =
  | { ok: true; distanceKm: number; shippingCost: number }
  | { ok: false; error: string };

export type CreateOrderActionResult =
  | { ok: true; externalReference: string }
  | { ok: false; error: string };

type GeocodeActionInput = {
  readonly address: string;
};

type DeliveryCostActionInput = {
  readonly originLat: number;
  readonly originLng: number;
  readonly destLat: number;
  readonly destLng: number;
  readonly pricePerKm: number;
};

type CreateOrderActionInput = {
  readonly shopName: string;
  readonly payload: unknown;
};

export async function geocodeAddressAction({
  address,
}: GeocodeActionInput): Promise<GeocodeActionResult> {
  const parsed = geocodeAddressRequestDto.safeParse({ address });

  if (!parsed.success) {
    return { ok: false, error: "Ingresa una dirección válida" };
  }

  try {
    const useCase = new GeocodeAddressUseCase(new GoogleGeocodeService());
    const result = await useCase.execute(parsed.data);

    return { ok: true, lat: result.lat, lng: result.lng };
  } catch {
    return { ok: false, error: "No pudimos encontrar la dirección" };
  }
}

export async function calculateDeliveryCostAction({
  originLat,
  originLng,
  destLat,
  destLng,
  pricePerKm,
}: DeliveryCostActionInput): Promise<DeliveryCostActionResult> {
  const parsed = calculateDeliveryCostRequestDto.safeParse({
    originLat,
    originLng,
    destLat,
    destLng,
    pricePerKm,
  });

  if (!parsed.success) {
    return { ok: false, error: "No pudimos calcular el envío" };
  }

  try {
    const useCase = new CalculateDeliveryCostUseCase(
      new GoogleDistanceMatrixService(),
    );
    const result = await useCase.execute(parsed.data);

    return {
      ok: true,
      distanceKm: result.distanceKm,
      shippingCost: result.shippingCost,
    };
  } catch {
    return { ok: false, error: "No hay ruta disponible a esa dirección" };
  }
}

export async function createOrderAction({
  shopName,
  payload,
}: CreateOrderActionInput): Promise<CreateOrderActionResult> {
  const shop = await getShopOrderFlow(shopName);

  if (!shop) {
    return { ok: false, error: "No encontramos la tienda" };
  }

  const parsed = createOrderRequestDto.safeParse(payload);

  if (!parsed.success) {
    return { ok: false, error: "Revisa los datos del pedido" };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const useCase = new CreateOrderUseCase(
      new SupabaseCreateOrderRepository(supabase),
    );
    const result = await useCase.execute({
      shopName,
      orderFlow: shop.orderFlow,
      shopId: shop.shopId,
      payload: parsed.data,
    });

    return { ok: true, externalReference: result.externalReference };
  } catch (error) {
    if (
      error instanceof DomainError &&
      error.code === SHOP_FLOW_MISMATCH_CODE
    ) {
      return { ok: false, error: "shop does not use the dashboard flow" };
    }

    return { ok: false, error: "No pudimos crear el pedido" };
  }
}
