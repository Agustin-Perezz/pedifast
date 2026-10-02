import type { PatchCheckoutForm } from "../checkout/hooks/use-checkout-screen";
import type { CheckoutSubmissionState } from "../checkout/hooks/use-checkout-submission";

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
