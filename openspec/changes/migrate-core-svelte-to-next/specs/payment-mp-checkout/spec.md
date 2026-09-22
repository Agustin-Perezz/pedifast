# Payment (Mercado Pago) & Checkout Specification

## Purpose

Defines Mercado Pago integration: per-shop OAuth (authorize/callback/refresh), hosted-checkout preference creation, and receipt-page payment verification. Payment confirmation is receipt-driven — MP webhooks are explicitly OUT of scope.

## Requirements

### Requirement: Per-shop OAuth authorize

The system MUST support starting Mercado Pago OAuth for a shop. The authorize endpoint MUST:
- require a `shop` query parameter (else 400);
- generate a signed OAuth `state` (base64url JSON of `{ shop, timestamp, signature }`, HMAC-SHA256 over `shop:timestamp` using `MP_OAUTH_STATE_SECRET`);
- redirect the shop owner to MP's authorization URL with `client_id = MP_APP_ID`, `redirect_uri = MP_REDIRECT_URI`, and the signed `state`.

#### Scenario: Authorize redirects to MP

- GIVEN a shop owner requests `/api/mp/oauth/authorize?shop=pizzeria-luca`
- WHEN the request is handled
- THEN the response redirects (302) to MP's authorization URL with a signed state referencing `pizzeria-luca`

#### Scenario: Missing shop parameter

- GIVEN a request to the authorize endpoint with no `shop` parameter
- WHEN handled
- THEN the system responds 400 with a missing-parameter error

### Requirement: Per-shop OAuth callback

The system MUST handle the MP OAuth callback. It MUST:
- require `code` and `state` (else 400);
- validate the `state` (HMAC signature, and timestamp not older than 10 minutes) — invalid state → 403;
- exchange the `code` for tokens;
- persist the shop's MP tokens (`mp_access_token`, `mp_refresh_token`, `mp_token_expires_at`, `mp_user_id`, `mp_public_key`, `connected_at`).

On success, the system MUST redirect to `/{shop}/pedir?mp_connected=true`. If the shop is not found when persisting (0 rows updated), the system MUST respond 404.

#### Scenario: Successful callback stores tokens and redirects

- GIVEN a valid `code` and valid `state` for shop `pizzeria-luca`
- WHEN the callback is handled
- THEN the shop's MP tokens are persisted and the owner is redirected to `/pizzeria-luca/pedir?mp_connected=true`

#### Scenario: Invalid state is rejected

- GIVEN a callback with an invalid or expired `state`
- WHEN handled
- THEN the system responds 403 and stores no tokens

#### Scenario: Shop not found on persist

- GIVEN a valid code/state but the shop no longer exists in the database
- WHEN the callback persists tokens
- THEN the system responds 404

### Requirement: Token refresh with 1-hour buffer

The system MUST obtain a seller access token for a shop, refreshing it when it is expired or within a 1-hour expiry buffer. When the access token is still valid beyond the buffer, the stored token MUST be returned without a network refresh. On refresh, the system MUST persist the new access token, refresh token, and expiry.

The system MUST reject when a shop has no stored MP tokens (not connected to MP).

#### Scenario: Valid token is reused

- GIVEN a shop with a token expiring in 3 hours
- WHEN the seller token is requested
- THEN the stored access token is returned with no refresh

#### Scenario: Token near expiry is refreshed

- GIVEN a shop with a token expiring in 30 minutes (within the 1-hour buffer)
- WHEN the seller token is requested
- THEN the system refreshes the token and persists the new tokens

#### Scenario: Shop not connected to MP

- GIVEN a shop with no `mp_access_token`
- WHEN the seller token is requested
- THEN the system errors indicating the shop is not connected to Mercado Pago

### Requirement: Hosted-checkout preference creation

The system MUST create an MP hosted-checkout preference for an order. It MUST:
- build `external_reference = ${shopName}-${Date.now()}`;
- map each cart item to a preference item with `title`, `quantity`, `unit_price`, and `currency_id = ARS`;
- set `metadata` with `shop_name`, `nombre`, `notas`, `delivery_method`, `address`.

When the base URL is NOT `localhost`, the system MUST set `back_urls` (success/failure/pending all pointing to `/pedido/{externalReference}`) and `auto_return = approved`. On `localhost`, back_urls/auto_return MUST be omitted (MP sandbox behavior parity).

The system MUST return the `init_point`, `preference_id`, and `externalReference`.

#### Scenario: Preference created with back_urls on production

- GIVEN a non-localhost base URL and a valid order
- WHEN the preference is created
- THEN `external_reference` is `${shopName}-${timestamp}`, back_urls point to `/pedido/{externalReference}`, and `auto_return` is `approved`

#### Scenario: No back_urls on localhost

- GIVEN a localhost base URL
- WHEN the preference is created
- THEN back_urls and auto_return are omitted

### Requirement: Receipt payment verification

The system MUST verify payment on the receipt page (`/pedido/{id}`) using the `payment_id` query parameter. It MUST:
- derive `shopName` from the order id (substring before the last `-`);
- fetch the MP payment for `payment_id` using that shop's seller token;
- compare the payment's `external_reference` against the order id — a mismatch MUST resolve the status to `pending` and MUST NOT persist a false approval;
- when the order is a dashboard order, update the order's `payment_status` server-side.

When `status`/`collection_status` is `efectivo`, the system MUST treat the order as approved/cash without contacting MP. When no `payment_id` is present, the status MUST resolve to `pending`.

#### Scenario: Payment verified and cross-checked

- GIVEN a receipt URL with a `payment_id` whose MP payment has `external_reference` equal to the order id and `status = approved`
- WHEN the receipt page loads
- THEN the verified status is `approved` and (for dashboard flow) the order's payment_status is updated to `approved`

#### Scenario: External reference mismatch stays pending

- GIVEN a `payment_id` whose MP payment `external_reference` differs from the order id
- WHEN the receipt page loads
- THEN the status resolves to `pending` and no payment_status update is written

#### Scenario: Cash order skips MP verification

- GIVEN a receipt URL with `status=efectivo`
- WHEN the receipt page loads
- THEN the order is treated as cash-approved without contacting MP

### Requirement: WhatsApp-flow receipt handling

For a `whatsapp`-flow order, the system MUST read the pending order from `localStorage` under `order-{id}`. The receipt page MUST derive the order date from the order id's trailing timestamp. When the order is confirmed (cash or `approved` payment), the system MUST build a WhatsApp deep link to the shop's `whatsappPhone` with the order summary, remove the `order-{id}` entry from `localStorage`, and open/redirect to `wa.me`.

#### Scenario: Confirmed WhatsApp order opens WhatsApp link

- GIVEN a whatsapp-flow receipt with status `approved` and a matching `localStorage` order
- WHEN the receipt page loads
- THEN the system builds the WhatsApp link, removes the `order-{id}` entry, and opens `wa.me`

#### Scenario: Missing localStorage order shows not found

- GIVEN a whatsapp-flow receipt with no `order-{id}` entry in `localStorage`
- WHEN the receipt page loads
- THEN the page shows a "order not found" state without a WhatsApp link

### Requirement: MP webhooks (deferred)

The system MUST NOT implement Mercado Pago webhook endpoints. Payment confirmation MUST rely solely on receipt-page verification. (Reason: deferred by explicit user decision.) (Migration: none — this is a follow-up enhancement tracked separately.)

#### Scenario: No webhook endpoint exists

- GIVEN a payment changes state on the MP side
- WHEN a webhook-style notification would otherwise arrive
- THEN there is no webhook endpoint to receive it, and payment status is resolved exclusively through receipt-page verification
