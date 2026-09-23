import type {
  GeoCoordinates,
  GeocodeProvider,
} from "@/application/use-cases/geocode-address/geocode-address.repository.interface";
import { AddressNotFoundError } from "@/domain/entities/address-not-found.error";
import { UpstreamGeoError } from "@/domain/entities/upstream-geo.error";
import {
  googleMapsApiKey,
  googleMapsBaseUrl,
} from "@/lib/shared/infrastructure/env";
import {
  COUNTRY_COMPONENT,
  DEFAULT_CITY,
  DEFAULT_PROVINCE,
  GEOCODING_LANGUAGE,
} from "./google-geo.constants";

const GEOCODING_ENDPOINT = "/geocode/json";
const ARGENTINA_SUFFIX = "Argentina";

type GoogleGeocodeResult = {
  readonly geometry: {
    readonly location: {
      readonly lat: number;
      readonly lng: number;
    };
  };
};

type GoogleGeocodeResponse = {
  readonly status: string;
  readonly results: GoogleGeocodeResult[];
};

export type Fetcher = (input: string) => Promise<{
  readonly ok: boolean;
  readonly status: number;
  json: () => Promise<unknown>;
}>;

export class GoogleGeocodeService implements GeocodeProvider {
  constructor(private readonly fetcher: Fetcher = fetch) {}

  async geocode(
    address: string,
    city = DEFAULT_CITY,
    province = DEFAULT_PROVINCE,
  ): Promise<GeoCoordinates> {
    const fullQuery = `${address}, ${city}, ${province}, ${ARGENTINA_SUFFIX}`;

    const params = new URLSearchParams({
      address: fullQuery,
      key: googleMapsApiKey,
      components: COUNTRY_COMPONENT,
      language: GEOCODING_LANGUAGE,
    });

    const response = await this.fetcher(
      `${googleMapsBaseUrl}${GEOCODING_ENDPOINT}?${params.toString()}`,
    );

    if (!response.ok) {
      throw new UpstreamGeoError(
        `Google Geocoding API error: ${response.status}`,
      );
    }

    const data = (await response.json()) as GoogleGeocodeResponse;

    if (data.status !== "OK" || data.results.length === 0) {
      throw new AddressNotFoundError(address);
    }

    const result = data.results[0];
    const { lat, lng } = result.geometry.location;

    return { lat, lng };
  }
}
