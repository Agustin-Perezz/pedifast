export type DistanceResult = {
  readonly distanceMeters: number;
  readonly distanceKm: number;
};

export type GeoPoint = {
  readonly lat: number;
  readonly lng: number;
};

export interface DistanceMatrixProvider {
  computeDistance(
    origin: GeoPoint,
    destination: GeoPoint,
  ): Promise<DistanceResult>;
}
