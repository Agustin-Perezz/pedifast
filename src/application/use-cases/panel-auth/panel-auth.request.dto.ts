import { z } from "zod";

export const panelLoginRequestDto = z.object({
  shopName: z.string().min(1),
  pin: z.string().min(1),
});

export type PanelLoginRequestDto = z.infer<typeof panelLoginRequestDto>;
