# Deferred Features

This document tracks features that are intentionally out of scope in the current
implementation. Each entry states the reason and the expected follow-up.

## Mercado Pago webhooks

The app does not implement MP webhook endpoints (`mp/webhook` or similar).
Payment confirmation relies exclusively on receipt-page verification
(`/pedido/[id]` with `payment_id`) — see
`openspec/changes/migrate-core-svelte-to-next/specs/payment-mp-checkout/spec.md`,
requirement "MP webhooks (deferred)".

Reason: deferred by explicit product decision during the SvelteKit → Next.js
migration. The old app also shipped without webhooks.

Follow-up: implement an MP webhook listener that updates `payment_status` for
dashboard orders when MP pushes payment notifications, adding an authenticated
`x-signature` header check (MP `webhook secret`) and an idempotent
payment-id-to-order guard.

## Leaflet address map picker

Delivery address input is plain-text only. The old app had no map picker
either.

Reason: deferred by product decision — see the `delivery-pricing` spec,
requirement "Leaflet map picker (deferred)".

Follow-up: add a Leaflet map picker backed by the existing geocode server
action, with OpenStreetMap tiles (already allowlisted in the CSP port plan).