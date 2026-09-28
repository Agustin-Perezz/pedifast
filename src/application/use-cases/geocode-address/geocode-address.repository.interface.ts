export type GeoCoordinates = {
  readonly lat: number;
  readonly lng: number;
};

export interface GeocodeProvider {
  geocode(
    address: string,
    city?: string,
    province?: string,
  ): Promise<GeoCoordinates>;
}
