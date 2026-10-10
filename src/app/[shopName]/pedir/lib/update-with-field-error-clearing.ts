import type { PatchCheckoutForm } from "../checkout/hooks/useCheckoutScreen";
import type { CheckoutSubmissionState } from "../checkout/hooks/useCheckoutSubmission";

type UpdateCheckoutForm = (patch: PatchCheckoutForm) => void;

export function updateWithFieldErrorClearing(
  update: UpdateCheckoutForm,
  submission: CheckoutSubmissionState,
): UpdateCheckoutForm {
  return (patch) => {
    update(patch);
    if (
      submission.fieldError !== null &&
      patch[submission.fieldError] !== undefined
    ) {
      submission.clearFieldError();
    }
  };
}
