import { DomainError } from "./errors";

export class PanelAuthError extends DomainError {
  constructor(message: string, code: string) {
    super(message, code);
    this.name = "PanelAuthError";
  }
}

export class OrderNotOwnedByShopError extends DomainError {
  constructor() {
    super(
      "Order not found or does not belong to this shop",
      "ORDER_NOT_OWNED_BY_SHOP",
    );
    this.name = "OrderNotOwnedByShopError";
  }
}
