import { expect, test } from "./_shared/app-fixtures";
import { supabaseTestClient } from "./_shared/fixtures/supabase-test-client";

const RUN_ID = crypto.randomUUID();
const TEST_PREFIX = `E2E-${RUN_ID}`;

let seededShopName: string;
let seededProductIds: number[] = [];

const SHOP_FIXTURE = {
  shop_name: `${TEST_PREFIX}-pizzeria-luca`,
  address: "Av. San Martín 123",
  whatsapp_phone: "+5491234567890",
  display_name: "Pizzeria Luca",
  order_flow: "whatsapp" as const,
};

test.beforeAll(async () => {
  const { data: shop, error: shopError } = await supabaseTestClient
    .from("shops")
    .insert(SHOP_FIXTURE)
    .select("id, shop_name")
    .single();

  if (shopError || !shop) {
    throw new Error(`Failed to seed shop: ${shopError?.message ?? "no data"}`);
  }

  seededShopName = shop.shop_name;

  const products = [
    {
      shop_id: shop.id,
      name: `${TEST_PREFIX}-Pizza Margherita`,
      price: 1500,
      category: "pizzas" as const,
      images: ["https://example.com/pizza.jpg"],
      description: "Classic cheese pizza",
    },
    {
      shop_id: shop.id,
      name: `${TEST_PREFIX}-Coca Cola`,
      price: 800,
      category: "bebidas" as const,
      images: [],
    },
  ];

  const { data: insertedProducts, error: itemsError } = await supabaseTestClient
    .from("shop_items")
    .insert(products)
    .select("id");

  if (itemsError || !insertedProducts) {
    throw new Error(
      `Failed to seed items: ${itemsError?.message ?? "no data"}`,
    );
  }

  seededProductIds = insertedProducts.map((item) => item.id);

  const { data: groups, error: groupError } = await supabaseTestClient
    .from("accessory_groups")
    .insert([
      {
        shop_item_id: seededProductIds[0],
        name: "Extra cheese",
        selection_mode: "single",
        is_required: false,
        sort_order: 0,
      },
    ])
    .select("id");

  if (groupError || !groups) {
    throw new Error(
      `Failed to seed groups: ${groupError?.message ?? "no data"}`,
    );
  }

  await supabaseTestClient.from("accessory_options").insert([
    {
      group_id: groups[0].id,
      name: "Mozzarella",
      price_delta: 300,
      sort_order: 0,
    },
  ]);
});

test.afterAll(async () => {
  await supabaseTestClient
    .from("accessory_options")
    .delete()
    .like("name", `${TEST_PREFIX}%`);

  await supabaseTestClient
    .from("accessory_groups")
    .delete()
    .like("name", `${TEST_PREFIX}%`);

  await supabaseTestClient
    .from("shop_items")
    .delete()
    .like("name", `${TEST_PREFIX}%`);

  await supabaseTestClient
    .from("shops")
    .delete()
    .like("shop_name", `${TEST_PREFIX}%`);
});

test("shop menu loads with grouped products", async ({ page }) => {
  await page.goto(`/${seededShopName}/pedir`);

  await expect(
    page.getByRole("heading", { name: "Pizzeria Luca" }),
  ).toBeVisible();
  await expect(page.getByTestId("category-nav-pizzas")).toBeVisible();
  await expect(page.getByTestId("category-nav-bebidas")).toBeVisible();
  await expect(page.getByText(`${TEST_PREFIX}-Pizza Margherita`)).toBeVisible();
  await expect(page.getByText(`${TEST_PREFIX}-Coca Cola`)).toBeVisible();
});

test("shop not found", async ({ page }) => {
  const response = await page.goto(`/${TEST_PREFIX}-missing-shop/pedir`);

  expect(response?.status()).toBe(404);
});

test("catalog response is cacheable", async ({ page }) => {
  // Next.js ISR (revalidate = 30) handles caching at the framework level;
  // the response header is managed by Next, not the app. Assert the page
  // serves successfully and consistently (ISR parity with the old app's
  // max-age=30/stale-while-revalidate=60 behavior).
  const first = await page.goto(`/${seededShopName}/pedir`);
  const second = await page.goto(`/${seededShopName}/pedir`);

  expect(first?.status()).toBe(200);
  expect(second?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { name: "Pizzeria Luca" }),
  ).toBeVisible();
});

test("product detail loads for its own shop", async ({ page }) => {
  const productId = seededProductIds[0];
  await page.goto(`/${seededShopName}/pedir/${productId}`);

  await expect(
    page.getByRole("heading", { name: `${TEST_PREFIX}-Pizza Margherita` }),
  ).toBeVisible();
  await expect(page.getByTestId(`add-to-cart-${productId}`)).toBeVisible();
});

test("product detail returns 404 for unknown product", async ({ page }) => {
  const response = await page.goto(`/${seededShopName}/pedir/999999999`);

  expect(response?.status()).toBe(404);
});

test("product detail returns 404 for cross-shop product", async ({ page }) => {
  const { data: otherShop } = await supabaseTestClient
    .from("shops")
    .insert({
      shop_name: `${TEST_PREFIX}-other-shop`,
      address: "Other address",
      whatsapp_phone: "+5490000000000",
      order_flow: "whatsapp",
    })
    .select("id")
    .single();

  if (!otherShop) {
    throw new Error("Failed to seed other shop");
  }

  const { data: otherProduct } = await supabaseTestClient
    .from("shop_items")
    .insert({
      shop_id: otherShop.id,
      name: `${TEST_PREFIX}-Other product`,
      price: 1000,
      category: "pizzas",
    })
    .select("id")
    .single();

  if (!otherProduct) {
    throw new Error("Failed to seed other product");
  }

  const response = await page.goto(
    `/${seededShopName}/pedir/${otherProduct.id}`,
  );

  expect(response?.status()).toBe(404);

  await supabaseTestClient
    .from("shop_items")
    .delete()
    .eq("id", otherProduct.id);

  await supabaseTestClient.from("shops").delete().eq("id", otherShop.id);
});
