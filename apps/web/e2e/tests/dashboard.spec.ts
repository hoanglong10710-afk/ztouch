import { test, expect } from "@playwright/test";
import { APP_URL } from "../config";
import { signIn } from "../auth";
import { resetMockData, seedCard } from "../api";

test.beforeEach(async () => {
  await resetMockData();
});

test("dashboard loads after login and shows the signed-in user's cards", async ({ page, context }) => {
  await seedCard({ title: "Hồ sơ của tôi" });
  await signIn(context, APP_URL);

  await page.goto("/dashboard");

  await expect(page.getByText("e2e@example.com")).toBeVisible();
  await expect(page.getByText("Hồ sơ của tôi")).toBeVisible();
});

test("an unauthenticated visitor is redirected away from the dashboard", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/login$/);
});
