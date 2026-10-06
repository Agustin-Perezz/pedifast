import type { PlainAccessoryGroup } from "./serialize-catalog";

const SELECTION_MODE_SINGLE = "single";

/**
 * Computes the next full-set selection for an accessory group after the
 * user toggles one option. Idempotent by contract: the returned set is the
 * complete desired selection for the group.
 */
export function nextSelectionAfterToggle(
  group: PlainAccessoryGroup,
  selectedOptionIds: ReadonlySet<number>,
  toggledOptionId: number,
): readonly number[] {
  if (group.selectionMode === SELECTION_MODE_SINGLE) {
    // Radio behavior: the clicked option becomes the selection.
    return [toggledOptionId];
  }

  // Checkbox behavior: toggle within the current set.
  return selectedOptionIds.has(toggledOptionId)
    ? [...selectedOptionIds].filter((id) => id !== toggledOptionId)
    : [...selectedOptionIds, toggledOptionId];
}
