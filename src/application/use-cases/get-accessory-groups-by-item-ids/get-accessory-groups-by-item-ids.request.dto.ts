import { z } from "zod";

export const getAccessoryGroupsByItemIdsRequestDto = z.object({
  itemIds: z.array(z.number().int().positive()),
});

export type GetAccessoryGroupsByItemIdsRequestDto = z.infer<
  typeof getAccessoryGroupsByItemIdsRequestDto
>;
