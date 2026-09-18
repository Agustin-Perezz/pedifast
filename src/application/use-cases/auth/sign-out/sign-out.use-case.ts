import type { ISignOutRepository } from "./sign-out.repository.interface";

export class SignOutUseCase {
  constructor(private readonly repository: ISignOutRepository) {}

  async execute(): Promise<void> {
    await this.repository.signOut();
  }
}
