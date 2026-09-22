# Shop Catalog Specification

## Purpose

Defines the anonymous customer browsing experience: loading a shop's menu, navigating product categories with scroll-spy, and opening a single product's detail view. This capability is public — no authentication is required — and its data is cacheable because shop menus change infrequently.

## Requirements

### Requirement: Shop catalog load

The system MUST load a shop's menu by `shopName` and return the shop metadata together with its products, each enriched with its accessory groups (including accessory options). The shop metadata MUST include the fields the ordering and checkout flows depend on: `address`, `deliveryPrice`, `whatsappPhone`, `displayName`, `logoUrl`, `portraitUrl`, `openHours`, `lat`, `lng`, `pricePerKm`, and `orderFlow`.

The system MUST return a 404 (Not Found) when no shop matches the requested `shopName`.

The system MUST serve the shop catalog page with `Cache-Control: public, max-age=30, stale-while-revalidate=60` (behavior parity with the reference app).

#### Scenario: Shop menu loads with grouped products

- GIVEN a shop named `pizzeria-luca` exists with products spanning multiple categories and at least one product having accessory groups
- WHEN an anonymous customer opens `/{shopName}/pedir`
- THEN the page renders the shop header, the category navigation, and all products grouped by category
- AND each product that has accessory groups includes its groups and options in the loaded data

#### Scenario: Shop not found

- GIVEN no shop exists with the name `tienda-fantasma`
- WHEN an anonymous customer opens `/tienda-fantasma/pedir`
- THEN the system responds with 404 Not Found

#### Scenario: Catalog response is cacheable

- GIVEN a valid shop catalog request
- WHEN the server responds
- THEN the response includes `Cache-Control: public, max-age=30, stale-while-revalidate=60`

### Requirement: Category navigation with scroll-spy

The system MUST present products grouped into the fixed category set — `hamburguesas`, `pizzas`, `empanadas`, `papas`, `milanesas`, `bebidas`, `sandwiches`, `ensaladas` — in that canonical order. Categories that contain no products MUST be omitted from the navigation.

The system MUST render a sticky category navigation bar. Selecting a category MUST scroll the view to that category's section. As the customer scrolls, the system MUST highlight the category currently in view (scroll-spy via IntersectionObserver).

#### Scenario: Categories render in canonical order with only non-empty groups

- GIVEN a shop whose products span only `pizzas`, `bebidas`, and `empanadas`
- WHEN the menu page loads
- THEN the navigation shows `pizzas`, `empanadas`, and `bebidas` in canonical order
- AND categories with no products (`hamburguesas`, `papas`, `milanesas`, `sandwiches`, `ensaladas`) are absent from the navigation

#### Scenario: Selecting a category scrolls to its section

- GIVEN the menu page is loaded and multiple category sections are present
- WHEN the customer taps a category in the sticky navigation
- THEN the viewport scrolls smoothly to that category's product section

#### Scenario: Scroll-spy highlights the active category

- GIVEN the menu page is loaded with multiple category sections
- WHEN the customer scrolls so a given category section enters the active scroll region
- THEN that category becomes highlighted in the navigation

### Requirement: Product detail load

The system MUST load a single product by `shopName` and `productId`, returning the product (name, price, images, category, description, accessory groups with options) for display in a detail view.

The system MUST return 404 (Not Found) when:
- no shop matches `shopName`;
- no product matches `productId`;
- the product exists but belongs to a different shop than `shopName` (the product MUST NOT be disclosed across shops).

The product detail page MUST be served with the same `Cache-Control: public, max-age=30, stale-while-revalidate=60` header.

#### Scenario: Product detail loads for its own shop

- GIVEN shop `pizzeria-luca` owns product `42`
- WHEN an anonymous customer opens `/pizzeria-luca/pedir/42`
- THEN the product detail view renders the product's image carousel, name, category, description, price, and add-to-cart control

#### Scenario: Product belongs to another shop

- GIVEN product `42` belongs to shop `pizzeria-luca` and shop `pizzeria-maria` exists
- WHEN an anonymous customer opens `/pizzeria-maria/pedir/42`
- THEN the system responds with 404 Not Found and does not reveal the product

#### Scenario: Unknown product id

- GIVEN shop `pizzeria-luca` has no product `9999`
- WHEN an anonymous customer opens `/pizzeria-luca/pedir/9999`
- THEN the system responds with 404 Not Found

### Requirement: Product image carousel

The system MUST display a product's images in a horizontally scrollable carousel. When a product has no images, the carousel MUST degrade gracefully (for example, a placeholder) rather than fail.

#### Scenario: Multiple images are browsable

- GIVEN a product has three images
- WHEN the customer opens the product detail
- THEN all three images are reachable by horizontal swipe/navigation in the carousel

#### Scenario: No images present

- GIVEN a product has an empty image list
- WHEN the customer opens the product detail
- THEN the detail view renders without error, showing a placeholder where images would appear
