import type { CartContextValue } from "../../context/cart-context";
import type { CheckoutFormState } from "../../hooks/useCheckoutForm";
import type {
  PlainAccessoryGroup,
  PlainAccessoryOption,
} from "../../lib/serialize-catalog";
import type { CheckoutFieldError } from "../../lib/submit-checkout";
import type { PatchCheckoutForm } from "../hooks/useCheckoutScreen";
import type { CheckoutScreenContentShop } from "./checkout-screen-content-shop";
import type { CartItemExtras } from "./item-extras-map";

export type CheckoutScreenContentProps = {
  readonly form: CheckoutFormState;
  readonly update: (patch: PatchCheckoutForm) => void;
  readonly itemExtras: ReadonlyMap<number, CartItemExtras>;
  readonly accessoryGroupsByItemId: ReadonlyMap<
    number,
    readonly PlainAccessoryGroup[]
  >;
  readonly onSelectAccessories: (
    itemId: number,
    group: PlainAccessoryGroup,
    selectedOptions: readonly PlainAccessoryOption[],
  ) => void;
  readonly cart: CartContextValue;
  readonly shopName: string;
  readonly shop: CheckoutScreenContentShop;
  readonly isDelivery: boolean;
  readonly fieldError: CheckoutFieldError | null;
  readonly showMissingAccessoryHints: boolean;
};
