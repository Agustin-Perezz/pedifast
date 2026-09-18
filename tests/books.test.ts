import { expect, test } from "./_shared/app-fixtures";
import { supabaseTestClient } from "./_shared/fixtures/supabase-test-client";

const RUN_ID = crypto.randomUUID();
const TEST_PREFIX = `E2E-${RUN_ID}`;
const seededTitles: string[] = [];

test.beforeAll(async () => {
  const titles = [
    `${TEST_PREFIX}-Pragmatic`,
    `${TEST_PREFIX}-Clean`,
    `${TEST_PREFIX}-Refactoring`,
  ];

  const { error } = await supabaseTestClient
    .from("books")
    .insert(
      titles.map((title) => ({ title, author: `${TEST_PREFIX} Author` })),
    );

  if (error) {
    throw new Error(`Failed to seed test books: ${error.message}`);
  }

  seededTitles.push(...titles);
});

test.afterAll(async () => {
  if (seededTitles.length === 0) return;

  const { error } = await supabaseTestClient
    .from("books")
    .delete()
    .like("title", `${TEST_PREFIX}%`);

  if (error) {
    throw new Error(`Failed to clean up test books: ${error.message}`);
  }
});

test("books page loads and shows heading", async ({ page }) => {
  await page.goto("/books");

  await expect(page.getByRole("heading", { name: "Books" })).toBeVisible();
  await expect(page.getByPlaceholder("Title")).toBeVisible();
  await expect(page.getByPlaceholder("Author")).toBeVisible();
  await expect(page.getByRole("button", { name: "Add" })).toBeVisible();
});

test("user can create a book via the form", async ({
  authenticatedPage: page,
}) => {
  const title = `${TEST_PREFIX}-create-${Date.now()}`;
  const author = `${TEST_PREFIX} Created Author`;

  await page.goto("/books");

  await page.getByPlaceholder("Title").fill(title);
  await page.getByPlaceholder("Author").fill(author);
  await page.getByRole("button", { name: "Add" }).click();

  await page.waitForURL("/books");

  await expect(page.getByText(title)).toBeVisible();
  await expect(page.getByText(author)).toBeVisible();
});
