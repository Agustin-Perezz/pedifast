import { describe, expect, it, vi } from "vitest";
import { AddressNotFoundError } from "@/domain/entities/address-not-found.error";
import { UpstreamGeoError } from "@/domain/entities/upstream-geo.error";
import {
  COUNTRY_COMPONENT,
  DEFAULT_CITY,
  DEFAULT_PROVINCE,
  GEOCODING_LANGUAGE,
} from "./google-geo.constants";
import { type Fetcher, GoogleGeocodeService } from "./google-geocode.service";

vi.mock("@/lib/shared/infrastructure/env", () => ({
  googleMapsApiKey: "test-api-key",
  googleMapsBaseUrl: "https://maps.example.com",
}));

function makeMockFetcher(
  response: {
    readonly ok: boolean;
    readonly status: number;
    readonly data?: unknown;
  } = { ok: true, status: 200, data: {} },
): Fetcher {
  return vi.fn().mockResolvedValue({
    ok: response.ok,
    status: response.status,
    json: vi.fn().mockResolvedValue(response.data),
  });
}

function createService(fetcher: Fetcher): GoogleGeocodeService {
  return new GoogleGeocodeService(fetcher);
}

describe("GoogleGeocodeService", () => {
  it("geocodes with default city and province", async () => {
    const address = "San Martín 123";
    const fetcher = makeMockFetcher({
      ok: true,
      status: 200,
      data: {
        status: "OK",
        results: [
          {
            geometry: { location: { lat: -31.4489, lng: -60.9316 } },
          },
        ],
      },
    });
    const service = createService(fetcher);

    const result = await service.geocode(address);

    expect(result).toEqual({ lat: -31.4489, lng: -60.9316 });
    expect(fetcher).toHaveBeenCalledTimes(1);
    const [url] = (fetcher as unknown as { mock: { calls: unknown[][] } }).mock
      .calls[0];
    const parsedUrl = new URL(url as string);
    expect(parsedUrl.searchParams.get("address")).toEqual(
      `${address}, ${DEFAULT_CITY}, ${DEFAULT_PROVINCE}, Argentina`,
    );
    expect(parsedUrl.searchParams.get("components")).toEqual(COUNTRY_COMPONENT);
    expect(parsedUrl.searchParams.get("language")).toEqual(GEOCODING_LANGUAGE);
    expect(parsedUrl.searchParams.get("key")).toEqual("test-api-key");
  });

  it("uses explicit city and province when provided", async () => {
    const fetcher = makeMockFetcher({
      ok: true,
      status: 200,
      data: {
        status: "OK",
        results: [{ geometry: { location: { lat: -32, lng: -61 } } }],
      },
    });
    const service = createService(fetcher);

    await service.geocode("Belgrano 456", "Rosario", "Santa Fe");

    const [url] = (fetcher as unknown as { mock: { calls: unknown[][] } }).mock
      .calls[0];
    const parsedUrl = new URL(url as string);
    expect(parsedUrl.searchParams.get("address")).toEqual(
      "Belgrano 456, Rosario, Santa Fe, Argentina",
    );
  });

  it("throws AddressNotFoundError when Google returns no results", async () => {
    const fetcher = makeMockFetcher({
      ok: true,
      status: 200,
      data: { status: "ZERO_RESULTS", results: [] },
    });
    const service = createService(fetcher);

    await expect(service.geocode("Unknown Place")).rejects.toThrow(
      AddressNotFoundError,
    );
  });

  it("throws UpstreamGeoError when the HTTP response is not ok", async () => {
    const fetcher = makeMockFetcher({ ok: false, status: 500 });
    const service = createService(fetcher);

    await expect(service.geocode("San Martín 123")).rejects.toThrow(
      UpstreamGeoError,
    );
  });
});
