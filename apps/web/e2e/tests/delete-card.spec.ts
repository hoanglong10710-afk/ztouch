import { test, expect } from "@playwright/test";
import { APP_URL } from "../config";
import { signIn } from "../auth";
import { resetMockData, seedCard } from "../api";

test.beforeEach(async () => {
  await resetMockData();
});

test("deleting a card removes it from the dashboard list", async ({ page, context }) => {
  await seedCard({ title: "Hồ sơ sẽ bị xóa" });
  await signIn(context, APP_URL);

  await page.goto("/dashboard");
  await expect(page.getByText("Hồ sơ sẽ bị xóa")).toBeVisible();

  await page.getByRole("button", { name: "Xóa" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Xóa" }).click();

  await expect(page.getByText("Hồ sơ sẽ bị xóa")).not.toBeVisible();
});
