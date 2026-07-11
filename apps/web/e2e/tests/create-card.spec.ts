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

  await page.getByRole("button", { name: "Tạo hồ sơ mới" }).click();

  await expect(page).toHaveURL(/\/dashboard\/edit\/.+/);
  await expect(page.getByLabel("Tiêu đề")).toHaveValue("Hồ sơ mới");
  await expect(page.getByRole("switch", { name: "Công khai hồ sơ" })).toBeChecked();
});
