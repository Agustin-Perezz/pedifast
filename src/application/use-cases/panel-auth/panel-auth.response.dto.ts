export type PanelLoginResponseDto =
  | {
      readonly ok: true;
      readonly shopId: number;
      readonly shopName: string;
    }
  | {
      readonly ok: false;
      readonly reason: "SHOP_NOT_FOUND" | "PANEL_DISABLED" | "INVALID_PIN";
    };
