import { DomainError } from "./errors";

export class NoRouteFoundError extends DomainError {
  constructor() {
    super("No route found between origin and destination", "NO_ROUTE_FOUND");
    this.name = "NoRouteFoundError";
  }
}
