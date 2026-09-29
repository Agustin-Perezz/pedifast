export type PanelActionResult =
  | { ok: true; whatsappUrl: string | null }
  | { ok: false; error: string };
