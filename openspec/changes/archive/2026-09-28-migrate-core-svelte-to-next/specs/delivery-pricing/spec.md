# Delivery Pricing (Geocoding & Delivery Cost) Specification

## Purpose

Defines the server-side geocoding and delivery-cost capabilities that replace the old Leaflet map picker. A customer provides a plain-text address; the server geocodes it to coordinates and computes a shipping cost using Google Distance Matrix against the shop's origin and `pricePerKm`. These are exposed as server actions (not route handlers), matching the repo's native form-action convention. The Leaflet map picker is explicitly OUT of scope.

## Requirements

### Requirement: Address geocoding

The system MUST geocode a plain-text delivery address server-side. It MUST:
- accept an `address` string (required) plus optional `city` (default `Esperanza`) and `province` (default `Santa Fe`);
- build the full query as `{address}, {city}, {province}, Argentina`;
- call Google Geocoding with `components=country:AR` and `language=es`;
- return `{ lat, lng }` of the top result.

The system MUST return an error (404) when the address is not found and an error (500) when the upstream geocoding service fails.

#### Scenario: Address geocodes with default city/province

- GIVEN a valid street address in Esperanza
- WHEN the geocode server action runs without an explicit city/province
- THEN it queries `{address}, Esperanza, Santa Fe, Argentina` and returns coordinates

#### Scenario: Address not found

- GIVEN an address Google cannot resolve
- WHEN the geocode server action runs
- THEN the system returns a not-found error (404)

#### Scenario: Missing address

- GIVEN a geocode request with no address
- WHEN the action runs
- THEN the system returns a missing-address error (400)

### Requirement: Delivery cost calculation

The system MUST compute a shipping cost server-side given the shop's origin coordinates, the destination coordinates, and the shop's `pricePerKm`. It MUST:
- call Google Distance Matrix in `driving` mode;
- extract the distance in meters from the first element;
- convert to kilometres;
- compute `shippingCost = round(distanceKm * pricePerKm)`;
- return `{ distanceMeters, distanceKm, shippingCost }`.

The system MUST return an error when the origin or destination coordinates are missing (400), when `pricePerKm` is missing or non-positive (400), when no route is found (404), or when the upstream service fails.

#### Scenario: Cost is round(distance × price per km)

- GIVEN a distance of 3.2 km and `pricePerKm` of 500
- WHEN the delivery cost is calculated
- THEN `shippingCost` is 1600

#### Scenario: No route found

- GIVEN coordinates with no drivable route
- WHEN the delivery cost is calculated
- THEN the system returns a no-route error (404)

### Requirement: Server actions, not route handlers

The geocode and delivery-cost capabilities MUST be exposed as Next.js server actions (native form actions), not as standalone route handlers. (SSE streaming and the MP OAuth callback remain route handlers; they are outside this capability.)

#### Scenario: Capability usable from a form action

- GIVEN the checkout flow needs to geocode and price a delivery address
- WHEN the checkout form submits
- THEN the geocode and delivery-cost logic runs server-side as part of the form action flow

### Requirement: Leaflet map picker (deferred)

The system MUST NOT implement a Leaflet-based interactive map picker. The delivery address MUST be collected as plain text (street + number) input. (Reason: deferred by explicit user decision; replaced by plain-text input → server geocode → delivery-cost.) (Migration: none — the map picker UI is dropped in favor of text input.)
