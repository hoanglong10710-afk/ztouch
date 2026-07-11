import { test, expect } from "@playwright/test";
import { APP_URL } from "../config";
import { signIn } from "../auth";
import { resetMockData } from "../api";

test.beforeEach(async () => {
  await resetMockData();
});

test("creating a card redirects straight to its edit page", async ({ page, context }) => {
  await signIn(context, APP_URL);
  await page.goto("/dashboard");

  // Both the header and the empty-state CTA render "Tạo hồ sơ mới" when
  // there are no cards yet -- pick the first (the header's) deterministically.
  await page.getByRole("button", { name: "Tạo hồ sơ mới" }).first().click();
  await page.getByRole("button", { name: "Tiếp tục" }).click();

  await expect(page).toHaveURL(/\/dashboard\/edit\/.+/);
  await expect(page.getByLabel("Tiêu đề")).toHaveValue("Hồ sơ mới");
  await expect(page.getByRole("switch", { name: "Công khai hồ sơ" })).toBeChecked();
});
