# Shop Panel Management Specification

## Purpose

Defines the shop-owner dashboard: PIN authentication, a real-time stream of incoming and updated orders, confirm/reject actions, and a printable ticket. Panel authentication is a SEPARATE auth path from the repo's supabase-auth `/dashboard` — it uses a PIN + HMAC-signed `panel_session` cookie and its own `requirePanelSession()` server guard.

## Requirements

### Requirement: Panel PIN authentication

The system MUST authenticate panel access via a per-shop PIN. The stored PIN MUST be a salted SHA-256 hash (`salt:hash` format) and verification MUST use constant-time comparison.

On successful login, the system MUST issue an HMAC-SHA256-signed `panel_session` cookie containing the shop id, shop name, and an expiry, valid for 7 days. The cookie MUST be `httpOnly`, `secure`, `sameSite=lax`, path `/`, with `maxAge` matching the 7-day session.

A shop without a configured `dashboard_pin_hash` MUST NOT allow login (panel is disabled for that shop).

#### Scenario: Correct PIN issues a session cookie

- GIVEN a shop with a configured PIN hash and a customer-provided PIN matching it
- WHEN the PIN is submitted
- THEN the system sets a signed `panel_session` cookie with the shop id and shop name
- AND redirects to `/{shopName}/panel`

#### Scenario: Wrong PIN is rejected

- GIVEN a shop with a configured PIN hash and an incorrect PIN
- WHEN the PIN is submitted
- THEN the system rejects the login with an error and issues no cookie

#### Scenario: Panel disabled when no PIN hash

- GIVEN a shop with no `dashboard_pin_hash`
- WHEN a login is attempted
- THEN the system rejects the login indicating the panel is not enabled for this shop

#### Scenario: Session cookie redirects away from login

- GIVEN a valid unexpired `panel_session` cookie for shop `S`
- WHEN the customer visits `/{S}/panel/login`
- THEN the system redirects to `/{S}/panel`

### Requirement: Panel session guard

The system MUST protect panel routes and actions with a `requirePanelSession()` guard (NOT the repo's `requireUser()`). The guard MUST verify the HMAC signature and expiry of the `panel_session` cookie, and MUST reject when the cookie's `shopName` does not match the requested `shopName` (deleting the invalid cookie before redirecting to login).

#### Scenario: Unauthenticated panel access redirects to login

- GIVEN no `panel_session` cookie
- WHEN the customer visits `/{shopName}/panel`
- THEN the system redirects to `/{shopName}/panel/login`

#### Scenario: Session for a different shop is rejected

- GIVEN a valid `panel_session` cookie for shop `A`
- WHEN the customer visits `/{B}/panel`
- THEN the system deletes the cookie and redirects to `/{B}/panel/login`

### Requirement: Real-time order stream (SSE)

The system MUST stream order events to an authenticated panel client over Server-Sent Events. The stream endpoint MUST:
- require a valid panel session whose `shopId` matches the requested `shopId`;
- emit a `connected` event on open;
- emit `new_order` events for `INSERT` events on `orders` filtered to the shop;
- emit `order_updated` events for `UPDATE` events on `orders` filtered to the shop;
- send keepalive comments at ~30s intervals to keep the connection alive.

The client MUST open an `EventSource` to this stream, prepend new orders to the list, update existing orders on `order_updated`, and play a notification sound on `new_order`.

#### Scenario: New order appears in real time

- GIVEN an authenticated panel client with an open SSE stream
- WHEN a new order is inserted for that shop
- THEN the client receives a `new_order` event and prepends the order to the pending list, playing a notification sound

#### Scenario: Order update propagates in real time

- GIVEN an authenticated panel client with an open SSE stream
- WHEN an existing order is updated (e.g. status change)
- THEN the client receives an `order_updated` event and replaces the corresponding order in its list

#### Scenario: Unauthorized stream is rejected

- GIVEN a stream request with no valid panel session, or a session whose `shopId` differs from the requested `shopId`
- WHEN the stream is requested
- THEN the system responds 401 Unauthorized

### Requirement: Pending and confirmed order lists

The system MUST load the shop's orders on the panel and render two lists: pending orders (`status = pending`) and confirmed orders (`status = confirmed`). The pending list MUST offer confirm and reject actions; the confirmed list MUST offer a print action only.

#### Scenario: Orders split into pending and confirmed

- GIVEN a shop with 2 pending and 1 confirmed order
- WHEN the panel loads
- THEN the pending list shows the 2 pending orders and the confirmed list shows the 1 confirmed order

### Requirement: Confirm order

The system MUST allow a shop owner to confirm a pending order. Confirmation MUST verify that the order belongs to the authenticated shop (ownership check) and set its `status` to `confirmed`. Attempting to confirm an order that does not belong to the shop MUST fail without changing any order.

#### Scenario: Confirm a pending order

- GIVEN a pending order belonging to the authenticated shop
- WHEN the owner confirms it
- THEN the order's `status` becomes `confirmed`

#### Scenario: Confirm rejects cross-shop order

- GIVEN an order id that does not belong to the authenticated shop
- WHEN the owner attempts to confirm it
- THEN the system rejects the action with an error and no order is changed

### Requirement: Reject order

The system MUST allow a shop owner to reject a pending order. Rejection MUST verify ownership (as with confirm) and set the order's `status` to `rejected`.

#### Scenario: Reject a pending order

- GIVEN a pending order belonging to the authenticated shop
- WHEN the owner rejects it
- THEN the order's `status` becomes `rejected`

### Requirement: WhatsApp confirmation deep link

When the owner confirms an order that has a `customerPhone`, the system MUST open a WhatsApp deep link (`https://wa.me/{sanitizedPhone}?text=...`) prefilled with a confirmation message summarizing the order.

#### Scenario: Confirmation opens WhatsApp

- GIVEN a confirmed order with a customer phone number
- WHEN the owner confirms it
- THEN a WhatsApp deep link opens with a prefilled confirmation message

#### Scenario: No WhatsApp when phone missing

- GIVEN a confirmed order with no customer phone
- WHEN the owner confirms it
- THEN no WhatsApp link is opened

### Requirement: Printable 80mm ticket

The system MUST render a printable ticket for a confirmed order, formatted for 80mm thermal receipt paper. The ticket MUST include the order date, external reference, customer name and phone, delivery method (or "RETIRO EN LOCAL"), item lines with quantity and accessories, delivery cost (when > 0), total, and notes. The ticket MUST only be visible in print media, not in the on-screen layout.

#### Scenario: Ticket contains all order fields

- GIVEN a confirmed delivery order with items, accessories, delivery cost, and notes
- WHEN the owner triggers print
- THEN the print output contains the customer, delivery method, item lines with accessories, delivery cost, total, and notes

#### Scenario: Pickup ticket shows local pickup

- GIVEN a confirmed pickup order
- WHEN the owner triggers print
- THEN the ticket shows "RETIRO EN LOCAL" instead of a delivery address

### Requirement: Notification sound

The system MUST play a notification sound when a new order arrives via the SSE stream. Autoplay restrictions MAY suppress the sound if the browser has not yet received user interaction; the failure MUST be swallowed silently.

#### Scenario: Sound plays on new order

- GIVEN an open panel with an SSE stream
- WHEN a `new_order` event arrives
- THEN the notification sound is played (subject to browser autoplay policy)
