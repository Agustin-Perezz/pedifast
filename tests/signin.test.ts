import { expect, test } from "./_shared/app-fixtures";

test("signin page renders all elements", async ({ page }) => {
  await page.goto("/signin");

  await expect(
    page.getByRole("heading", { name: "Sign in or sign up" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Send Magic Link" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Continue with Google" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Continue with Facebook" }),
  ).toBeVisible();
});

test("magic link with valid email shows success message", async ({ page }) => {
  await page.goto("/signin");

  await page.getByLabel("Email").fill(`e2e-${crypto.randomUUID()}@test.com`);
  await page.getByRole("button", { name: "Send Magic Link" }).click();

  await expect(
    page.getByText("Check your email for the sign-in link."),
  ).toBeVisible();
});

test("authenticated user is redirected to dashboard", async ({
  authenticatedPage,
}) => {
  await authenticatedPage.goto("/signin");

  await expect(authenticatedPage).toHaveURL("/dashboard");
});
