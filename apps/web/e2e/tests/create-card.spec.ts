import { test, expect } from "@playwright/test";
import { APP_URL } from "../config";
import { signIn } from "../auth";
import { resetMockData } from "../api";

test.beforeEach(async () => {
  await resetMockData();
});

test("creating a card adds it to the dashboard list", async ({ page, context }) => {
  await signIn(context, APP_URL);
  await page.goto("/dashboard");

  page.on("dialog", (dialog) => dialog.accept());

  await page.getByRole("button", { name: "Tạo hồ sơ mới" }).click();

  await expect(page.getByText("Hồ sơ mới")).toBeVisible();
  await expect(page.getByText(/Công khai$/)).toBeVisible();
});
