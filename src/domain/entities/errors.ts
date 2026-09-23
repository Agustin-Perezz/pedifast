export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export class BookNotFoundError extends DomainError {
  constructor(bookId: string) {
    super(`Book with id "${bookId}" was not found`, "BOOK_NOT_FOUND");
    this.name = "BookNotFoundError";
  }
}

export class InvalidBookError extends DomainError {
  constructor(message: string) {
    super(message, "INVALID_BOOK");
    this.name = "InvalidBookError";
  }
}

export class ShopNotFoundError extends DomainError {
  constructor(shopName: string) {
    super(`Shop with name "${shopName}" was not found`, "SHOP_NOT_FOUND");
    this.name = "ShopNotFoundError";
  }
}

export class InvalidOrderError extends DomainError {
  constructor(message: string) {
    super(message, "INVALID_ORDER");
    this.name = "InvalidOrderError";
  }
}

export class OrderExternalReferenceFormatError extends DomainError {
  constructor(reference: string) {
    super(
      `Invalid order external reference format: "${reference}"`,
      "INVALID_EXTERNAL_REFERENCE_FORMAT",
    );
    this.name = "OrderExternalReferenceFormatError";
  }
}

export class ShopFlowMismatchError extends DomainError {
  constructor(shopName: string) {
    super(
      `Shop "${shopName}" does not use the dashboard flow`,
      "SHOP_FLOW_MISMATCH",
    );
    this.name = "ShopFlowMismatchError";
  }
}
