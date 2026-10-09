import { z } from "zod";
import { AccessorySelectionMode } from "./accessory-selection-mode.enum";

export const accessoryGroupSchema = z.object({
  id: z.number().int().nonnegative(),
  shopItemId: z.number().int().positive(),
  name: z.string().min(1),
  selectionMode: z.enum(AccessorySelectionMode),
  isRequired: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AccessoryGroupSchema = z.infer<typeof accessoryGroupSchema>;
