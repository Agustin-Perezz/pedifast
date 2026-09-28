# Order Cart Specification

## Purpose

Defines the anonymous customer's shopping cart: adding and removing products, configuring accessories, and the two-step checkout overlay. The cart is held in a client-side React context (no external state library) and is in-memory only — refreshing the page loses the cart, matching the reference app.

## Requirements

### Requirement: In-memory cart state

The system MUST maintain the customer's cart in a client-side React context with no persistence to `localStorage`, session storage, or any server. A full page reload MUST reset the cart to empty (behavior parity).

The cart MUST track:
- `items` — the ordered list of cart items;
- `totalItems` — the sum of all item quantities;
- `totalPrice` — the sum of (unit price × quantity) across items;
- `isEmpty` — whether the cart contains any items.

#### Scenario: Cart is empty on first visit

- GIVEN an anonymous customer opens a shop menu for the first time
- WHEN the page renders
- THEN the cart contains no items and the cart bottom bar is hidden

#### Scenario: Reload clears the cart

- GIVEN the customer added two products to the cart
- WHEN the customer reloads the page
- THEN the cart is empty (no persistence)

### Requirement: Add and remove products

The system MUST support adding a product to the cart. Adding a product already in the cart MUST increment its quantity; adding a new product MUST append a new cart item with quantity 1 and no selected accessories.

The system MUST support removing a product: decrementing its quantity when it is above 1, and removing the item entirely when its quantity reaches 1.

The system MUST expose the current quantity of a product in the cart (for rendering add/remove controls on the product detail and product cards).

#### Scenario: Add a new product

- GIVEN an empty cart and a product `P` not in the cart
- WHEN the customer taps "add" for `P`
- THEN the cart contains one item `P` with quantity 1 and no accessories

#### Scenario: Add a product already in the cart

- GIVEN the cart contains product `P` with quantity 2
- WHEN the customer taps "add" for `P` again
- THEN the cart contains `P` with quantity 3

#### Scenario: Remove down to zero removes the item

- GIVEN the cart contains product `P` with quantity 1
- WHEN the customer taps "remove" for `P`
- THEN the cart no longer contains `P`

### Requirement: Unit price includes accessory deltas

The system MUST compute a cart item's unit price as the product base price plus the sum of `priceDelta` for every selected accessory. This unit price MUST be used for line totals and the cart total, and MUST flow through to order items at submission.

#### Scenario: Unit price reflects selected accessories

- GIVEN product `P` has base price $1000 and the customer selected an accessory with `priceDelta` $300
- WHEN the cart totals are computed
- THEN the unit price of `P` is $1300 and the line total for quantity 1 is $1300

### Requirement: Accessory selection modes

The system MUST support two accessory selection modes per accessory group:
- `single` — exactly one option MAY be selected (selecting a new option replaces the previous);
- `multi` — zero or more options MAY be selected (toggling an option adds or removes it).

Each option MUST carry a `priceDelta` that contributes to the unit price when selected.

#### Scenario: Single-select group replaces selection

- GIVEN a `single` accessory group with options `A` and `B`
- WHEN the customer selects `A` and then selects `B`
- THEN `B` is the only selected option for that group

#### Scenario: Multi-select group toggles options

- GIVEN a `multi` accessory group with options `A` and `B`
- WHEN the customer selects `A`, then `B`, then `A` again
- THEN the selected options are `B` only

### Requirement: Required-group gating

The system MUST prevent the customer from proceeding past the accessory step until every accessory group marked `isRequired` has at least one selected option. Optional groups MUST NOT block progression.

#### Scenario: Required group blocks continuation

- GIVEN a cart item has a required accessory group with no option selected
- WHEN the customer is on the accessory step and attempts to continue
- THEN the system blocks the continuation until the required group has a selection

#### Scenario: All required groups satisfied allows continuation

- GIVEN every required accessory group across all cart items has at least one selected option
- WHEN the customer taps continue on the accessory step
- THEN the checkout proceeds to the checkout form step

### Requirement: Two-step checkout overlay

The system MUST present checkout as an overlay with two steps:
1. **Accessories step** — shown only when at least one cart item has accessory groups; the customer configures selections and commits them to the cart.
2. **Checkout step** — order summary plus the checkout form.

When the cart has no items with accessory groups, opening checkout MUST skip straight to the checkout step.

The overlay MUST be adaptive: a dialog on desktop (viewport ≥ 768px) and a bottom drawer on mobile.

Committing the accessory step MUST persist the selections back onto the cart items (via `setAccessories`) before advancing.

#### Scenario: Accessories step shown when cart has configured items

- GIVEN the cart contains an item with accessory groups
- WHEN the customer opens checkout
- THEN the accessory step is shown first

#### Scenario: Checkout skips accessory step when no accessories

- GIVEN the cart contains only items without accessory groups
- WHEN the customer opens checkout
- THEN the checkout form step is shown directly

#### Scenario: Overlay adapts to viewport

- GIVEN checkout is open on a viewport ≥ 768px
- THEN it renders as a dialog
- AND on a viewport < 768px it renders as a bottom drawer

### Requirement: Cart bottom bar

The system MUST show a persistent bottom bar whenever the cart is non-empty, displaying the total item count and the total price, with a "Confirm order" action that opens the checkout overlay. The bar MUST be hidden when the cart is empty.

#### Scenario: Bottom bar reflects cart totals

- GIVEN the cart contains 2 units across items totaling $2600
- WHEN the menu page renders
- THEN the bottom bar shows "2 items" and $2600 with a "Confirm order" button

#### Scenario: Bottom bar hidden for empty cart

- GIVEN an empty cart
- WHEN the menu page renders
- THEN no cart bottom bar is shown
