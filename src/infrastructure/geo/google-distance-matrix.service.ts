import type {
  DistanceMatrixProvider,
  DistanceResult,
  GeoPoint,
} from "@/application/use-cases/calculate-delivery-cost/calculate-delivery-cost.repository.interface";
import { NoRouteFoundError } from "@/domain/entities/no-route-found.error";
import { UpstreamGeoError } from "@/domain/entities/upstream-geo.error";
import {
  googleMapsApiKey,
  googleMapsBaseUrl,
} from "@/lib/shared/infrastructure/env";
import { DISTANCE_MATRIX_MODE } from "./google-geo.constants";

const DISTANCE_MATRIX_ENDPOINT = "/distancematrix/json";

type DistanceMatrixElement = {
  readonly status: string;
  readonly distance: {
    readonly value: number;
  };
};

type DistanceMatrixResponse = {
  readonly rows: readonly {
    readonly elements: readonly DistanceMatrixElement[];
  }[];
};

export type Fetcher = (input: string) => Promise<{
  readonly ok: boolean;
  readonly status: number;
  json: () => Promise<unknown>;
}>;

export class GoogleDistanceMatrixService implements DistanceMatrixProvider {
  constructor(private readonly fetcher: Fetcher = fetch) {}

  async computeDistance(
    origin: GeoPoint,
    destination: GeoPoint,
  ): Promise<DistanceResult> {
    const params = new URLSearchParams({
      origins: `${origin.lat},${origin.lng}`,
      destinations: `${destination.lat},${destination.lng}`,
      mode: DISTANCE_MATRIX_MODE,
      key: googleMapsApiKey,
    });

    const response = await this.fetcher(
      `${googleMapsBaseUrl}${DISTANCE_MATRIX_ENDPOINT}?${params.toString()}`,
    );

    if (!response.ok) {
      throw new UpstreamGeoError(
        `Google Distance Matrix API error: ${response.status}`,
      );
    }

    const data = (await response.json()) as DistanceMatrixResponse;
    const element = data.rows[0]?.elements[0];

    if (element?.status !== "OK") {
      throw new NoRouteFoundError();
    }

    const distanceMeters = element.distance.value;
    const distanceKm = distanceMeters / 1000;

    return { distanceMeters, distanceKm };
  }
}
