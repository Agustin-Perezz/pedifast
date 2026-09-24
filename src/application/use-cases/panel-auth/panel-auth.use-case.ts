import type { PanelAuthRepository } from "./panel-auth.repository.interface";
import type { PanelLoginRequestDto } from "./panel-auth.request.dto";
import type { PanelLoginResponseDto } from "./panel-auth.response.dto";

export interface PanelPinVerifier {
  verify(pin: string, storedHash: string): boolean;
}

export class PanelAuthUseCase {
  constructor(
    private readonly repository: PanelAuthRepository,
    private readonly pinVerifier: PanelPinVerifier,
  ) {}

  async execute(dto: PanelLoginRequestDto): Promise<PanelLoginResponseDto> {
    const credentials = await this.repository.findPanelCredentialsByShopName(
      dto.shopName,
    );

    if (!credentials) {
      return { ok: false, reason: "SHOP_NOT_FOUND" };
    }

    if (!credentials.dashboardPinHash) {
      return { ok: false, reason: "PANEL_DISABLED" };
    }

    if (!this.pinVerifier.verify(dto.pin, credentials.dashboardPinHash)) {
      return { ok: false, reason: "INVALID_PIN" };
    }

    return {
      ok: true,
      shopId: credentials.id,
      shopName: credentials.shopName,
    };
  }
}
