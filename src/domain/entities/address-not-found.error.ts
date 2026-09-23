import { DomainError } from "./errors";

export class AddressNotFoundError extends DomainError {
  constructor(address: string) {
    super(`Address not found: "${address}"`, "ADDRESS_NOT_FOUND");
    this.name = "AddressNotFoundError";
  }
}
