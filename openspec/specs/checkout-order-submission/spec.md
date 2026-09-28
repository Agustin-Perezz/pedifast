# Checkout & Order Submission Specification

## Purpose

Defines the checkout form and the branching order flows. A customer enters their name and (optionally) phone and notes, chooses a delivery method, and, for delivery, provides a plain-text address that is geocoded and priced. The order is then submitted through one of two flows selected by the shop's `orderFlow`: `whatsapp` (order stays in the customer's browser only) or `dashboard` (order is persisted server-side and managed in the shop panel).

## Requirements

### Requirement: Checkout form validation

The system MUST validate the checkout form against the order schema. Specifically:
- `nombre` (customer name) MUST be non-empty;
- `telefono` (phone) MUST be non-empty when the shop's `orderFlow` is `dashboard`, and MAY be omitted in the `whatsapp` flow;
- `address` MUST be non-empty when `deliveryMethod` is `delivery`;
- `notas` MAY be omitted.

The `deliveryMethod` MUST be one of `pickup` or `delivery`, and the `paymentMethod` MUST be one of `mercadopago` or `efectivo`.

#### Scenario: Delivery requires an address

- GIVEN the customer selects `delivery` and leaves the address empty
- WHEN the form is submitted
- THEN the system rejects the submission with an address-required error and does not create an order

#### Scenario: Dashboard flow requires a phone number

- GIVEN the shop's `orderFlow` is `dashboard` and the customer leaves `telefono` empty
- WHEN the form is submitted
- THEN the system rejects the submission with a phone-required error

#### Scenario: WhatsApp flow allows omitted phone

- GIVEN the shop's `orderFlow` is `whatsapp` and the customer leaves `telefono` empty
- WHEN the form is submitted
- THEN the submission is accepted (name is the only required contact field)

### Requirement: Delivery method selection

The system MUST let the customer choose between `pickup` (retiro en local) and `delivery` (envío a domicilio). For `pickup`, the shop's address SHOULD be displayed. For `delivery`, the system MUST show a delivery cost once computed, or the shop's static `deliveryPrice` when dynamic pricing has not been computed.

#### Scenario: Pickup shows the shop address

- GIVEN the shop has a non-null `address`
- WHEN the customer selects `pickup`
- THEN the shop address is shown under the pickup option

#### Scenario: Delivery shows the computed cost

- GIVEN the customer selected `delivery` and a geocode + distance calculation produced a shipping cost
- WHEN the delivery method selector renders
- THEN the computed distance and shipping cost are displayed

### Requirement: Address geocoding and delivery cost

The system MUST accept a plain-text delivery address (street + number). It MUST geocode the address server-side (defaulting the city to `Esperanza` and the province to `Santa Fe`, Argentina) and compute a delivery cost from the shop's origin, the geocoded destination, and the shop's `pricePerKm`. This delegates to the `delivery-pricing` capability. The map picker is explicitly OUT of scope.

The computed delivery cost MUST be included in the order total when `deliveryMethod` is `delivery`; it MUST be `0` for `pickup`.

#### Scenario: Delivery cost is added to the total

- GIVEN a delivery order with items totaling $2000 and a computed shipping cost of $450
- WHEN the order total is computed
- THEN the total is $2450

#### Scenario: Pickup has no delivery cost

- GIVEN a pickup order with items totaling $2000
- WHEN the order total is computed
- THEN the delivery cost is $0 and the total is $2000

### Requirement: Order item serialization

The system MUST serialize cart items into order items for submission. Each order item MUST carry `name` (product name, plus the selected accessory option names in parentheses when present), `quantity`, `unitPrice` (base price + accessory deltas), and an optional `accessories` array of `{ name, priceDelta }` for selected accessories. The order `total` MUST include the delivery cost when applicable.

#### Scenario: Item name includes accessory names

- GIVEN a cart item for "Hamburguesa" with selected accessories "Doble carne" and "Cheddar"
- WHEN the order items are built
- THEN the item name is "Hamburguesa (Doble carne, Cheddar)"

### Requirement: Payment status derivation

The system MUST set the order's initial `paymentStatus` based on the chosen payment method:
- `efectivo` → `approved` (order is treated as paid/confirmed immediately);
- `mercadopago` → `pending` (payment is resolved later on the receipt page).

#### Scenario: Cash payment marks order approved

- GIVEN the customer submits with payment method `efectivo`
- WHEN the order is created
- THEN its `paymentStatus` is `approved`

#### Scenario: MP payment starts pending

- GIVEN the customer submits with payment method `mercadopago`
- WHEN the order is created
- THEN its `paymentStatus` is `pending`

### Requirement: WhatsApp order flow

For a shop whose `orderFlow` is `whatsapp`, the system MUST NOT write the order to the server. The system MUST store the pending order locally under the key `order-{externalReference}` in `localStorage` and then redirect the customer to the receipt page (`/pedido/{externalReference}`) with the appropriate status.

The `externalReference` MUST be `${shopName}-${Date.now()}` (it doubles as the order identifier).

#### Scenario: WhatsApp flow stores order locally only

- GIVEN a `whatsapp`-flow shop and a valid submission with payment method `mercadopago`
- WHEN the order is submitted
- THEN no order row is created server-side
- AND the pending order is stored under `order-{shopName}-{timestamp}` in `localStorage`
- AND the customer is redirected to the MP hosted checkout (init_point)

#### Scenario: WhatsApp cash order redirects to receipt

- GIVEN a `whatsapp`-flow shop and a valid submission with payment method `efectivo`
- WHEN the order is submitted
- THEN the pending order is stored in `localStorage` under `order-{shopName}-{timestamp}`
- AND the cart is cleared
- AND the customer is redirected to `/pedido/{shopName}-{timestamp}?status=efectivo`

### Requirement: Dashboard order flow

For a shop whose `orderFlow` is `dashboard`, the system MUST create a persisted order server-side. The submission MUST include `shopName`, `externalReference`, `customerName`, `customerPhone`, `notes`, `deliveryMethod`, `address`, `paymentMethod`, `paymentStatus`, `items`, `total`, and `deliveryCost`.

The system MUST reject the creation when the shop's `orderFlow` is not `dashboard`.

#### Scenario: Dashboard order is persisted

- GIVEN a `dashboard`-flow shop and a valid submission
- WHEN the order is submitted
- THEN an order row is created server-side with the provided fields
- AND the response returns the created order's `id` and `externalReference`

#### Scenario: Order rejected for non-dashboard shop

- GIVEN a `whatsapp`-flow shop
- WHEN a client attempts to create a dashboard order for that shop
- THEN the system responds with an error (400) indicating the shop does not use the dashboard flow

### Requirement: External reference format

The system MUST use `externalReference = ${shopName}-${Date.now()}` as the stable order identifier across both flows. The receipt page MUST be able to derive the shop name and creation timestamp from this value.

#### Scenario: External reference embeds shop and timestamp

- GIVEN a submission for shop `pizzeria-luca` at timestamp `1700000000000`
- WHEN the external reference is generated
- THEN it is `pizzeria-luca-1700000000000`

### Requirement: Cart cleared on completion

The system MUST clear the cart once an order has been successfully submitted (in either flow).

#### Scenario: Cart clears after successful submission

- GIVEN a non-empty cart
- WHEN an order is successfully submitted
- THEN the cart is empty
