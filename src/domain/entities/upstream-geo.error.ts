import { DomainError } from "./errors";

export class UpstreamGeoError extends DomainError {
  constructor(message: string) {
    super(message, "UPSTREAM_GEO_ERROR");
    this.name = "UpstreamGeoError";
  }
}
