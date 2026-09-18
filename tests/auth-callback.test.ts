import { expect, test } from "./_shared/app-fixtures";

test("auth callback with error param redirects to signin with error", async ({
  page,
}) => {
  await page.goto("/auth/callback?error=access_denied");

  await expect(page).toHaveURL(/\/signin\?error=access_denied/);
});

test("auth callback with no params redirects to signin", async ({ page }) => {
  await page.goto("/auth/callback");

  await expect(page).toHaveURL(/\/signin/);
});

test("auth callback with invalid code redirects to signin with auth_failed", async ({
  page,
}) => {
  await page.goto("/auth/callback?code=invalid-code");

  await expect(page).toHaveURL(/\/signin\?error=auth_failed/);
});
