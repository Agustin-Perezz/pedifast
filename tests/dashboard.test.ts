import { expect, test } from "./_shared/app-fixtures";

test("unauthenticated user is redirected to signin", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL("/signin");
});

test("authenticated user sees dashboard with their email", async ({
  authenticatedPage,
  testUser,
}) => {
  await authenticatedPage.goto("/dashboard");

  await expect(
    authenticatedPage.getByRole("heading", { name: "Dashboard" }),
  ).toBeVisible();
  await expect(authenticatedPage.getByText(testUser.email)).toBeVisible();
});

test("authenticated user can sign out", async ({ authenticatedPage }) => {
  await authenticatedPage.goto("/dashboard");

  await expect(
    authenticatedPage.getByRole("button", { name: "Sign out" }),
  ).toBeVisible();

  await authenticatedPage.getByRole("button", { name: "Sign out" }).click();

  await expect(authenticatedPage).toHaveURL("/signin");
  await expect(
    authenticatedPage.getByRole("heading", { name: "Sign in or sign up" }),
  ).toBeVisible();
});
