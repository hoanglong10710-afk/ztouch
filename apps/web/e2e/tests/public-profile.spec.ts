import { test, expect } from "@playwright/test";
import { seedCard, resetMockData } from "../api";

test.beforeEach(async () => {
  await resetMockData();
});

test("a public, active card renders on its public profile page", async ({ page }) => {
  const card = await seedCard({
    title: "Nguyễn Văn A",
    display_name: "Nguyễn Văn A",
    bio: "Xin chào, đây là hồ sơ công khai của tôi.",
    is_public: true,
    status: "active",
  });

  await page.goto(`/p/${card.public_id}`);

  await expect(page.getByRole("heading", { name: "Nguyễn Văn A" })).toBeVisible();
  await expect(page.getByText("Xin chào, đây là hồ sơ công khai của tôi.")).toBeVisible();
});

test("a private card returns not-found on its public profile page", async ({ page }) => {
  const card = await seedCard({ title: "Hồ sơ riêng tư", is_public: false });

  await page.goto(`/p/${card.public_id}`);

  await expect(page.getByRole("heading", { name: "Không tìm thấy hồ sơ" })).toBeVisible();
});

test("an inactive card returns not-found on its public profile page", async ({ page }) => {
  const card = await seedCard({ title: "Hồ sơ ngưng hoạt động", status: "inactive" });

  await page.goto(`/p/${card.public_id}`);

  await expect(page.getByRole("heading", { name: "Không tìm thấy hồ sơ" })).toBeVisible();
});

test("an unknown public id returns not-found", async ({ page }) => {
  await page.goto("/p/does-not-exist");

  await expect(page.getByRole("heading", { name: "Không tìm thấy hồ sơ" })).toBeVisible();
});
