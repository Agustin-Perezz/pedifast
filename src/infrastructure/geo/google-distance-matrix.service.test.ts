import { describe, expect, it, vi } from "vitest";
import { NoRouteFoundError } from "@/domain/entities/no-route-found.error";
import { UpstreamGeoError } from "@/domain/entities/upstream-geo.error";
import {
  type Fetcher,
  GoogleDistanceMatrixService,
} from "./google-distance-matrix.service";
import { DISTANCE_MATRIX_MODE } from "./google-geo.constants";

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

function createService(fetcher: Fetcher): GoogleDistanceMatrixService {
  return new GoogleDistanceMatrixService(fetcher);
}

describe("GoogleDistanceMatrixService", () => {
  it("computes distance with driving mode", async () => {
    const fetcher = makeMockFetcher({
      ok: true,
      status: 200,
      data: {
        rows: [
          {
            elements: [{ status: "OK", distance: { value: 3200 } }],
          },
        ],
      },
    });
    const service = createService(fetcher);

    const result = await service.computeDistance(
      { lat: -31.4489, lng: -60.9316 },
      { lat: -31.5, lng: -61 },
    );

    expect(result).toEqual({ distanceMeters: 3200, distanceKm: 3.2 });
    expect(fetcher).toHaveBeenCalledTimes(1);
    const [url] = (fetcher as unknown as { mock: { calls: unknown[][] } }).mock
      .calls[0];
    const parsedUrl = new URL(url as string);
    expect(parsedUrl.searchParams.get("mode")).toEqual(DISTANCE_MATRIX_MODE);
    expect(parsedUrl.searchParams.get("key")).toEqual("test-api-key");
  });

  it("throws NoRouteFoundError when the element status is not OK", async () => {
    const fetcher = makeMockFetcher({
      ok: true,
      status: 200,
      data: {
        rows: [{ elements: [{ status: "ZERO_RESULTS" }] }],
      },
    });
    const service = createService(fetcher);

    await expect(
      service.computeDistance(
        { lat: -31.4489, lng: -60.9316 },
        { lat: -90, lng: 0 },
      ),
    ).rejects.toThrow(NoRouteFoundError);
  });

  it("throws UpstreamGeoError on HTTP failure", async () => {
    const fetcher = makeMockFetcher({ ok: false, status: 503 });
    const service = createService(fetcher);

    await expect(
      service.computeDistance(
        { lat: -31.4489, lng: -60.9316 },
        { lat: -31.5, lng: -61 },
      ),
    ).rejects.toThrow(UpstreamGeoError);
  });
});
