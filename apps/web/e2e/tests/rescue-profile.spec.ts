import { test, expect } from "@playwright/test";
import { APP_URL } from "../config";
import { signIn } from "../auth";
import { resetMockData } from "../api";
import { saveAndConfirm } from "../helpers";

test.beforeEach(async () => {
  await resetMockData();
});

test("creating and editing a rescue profile persists medical and emergency contact data", async ({
  page,
  context,
}) => {
  await signIn(context, APP_URL);
  await page.goto("/dashboard");

  // Create: choose the rescue profile type.
  // Both the header and the empty-state CTA render "Tạo hồ sơ mới" when
  // there are no cards yet -- pick the first (the header's) deterministically.
  await page.getByRole("button", { name: "Tạo hồ sơ mới" }).first().click();
  await page.getByRole("button", { name: "Hồ sơ cứu hộ" }).click();
  await page.getByRole("button", { name: "Tiếp tục" }).click();

  await expect(page).toHaveURL(/\/dashboard\/edit\/.+/);
  await expect(page.getByRole("heading", { name: "Thông tin y tế" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Liên hệ khẩn cấp" })).toBeVisible();

  // Edit: fill in the medical fields and the primary emergency contact.
  await page.getByLabel("Nhóm máu").fill("O+");
  await page.getByLabel("Dị ứng").fill("Penicillin");
  await page.getByLabel("Tình trạng bệnh lý").fill("Hen suyễn");
  await page.getByLabel("Thuốc đang sử dụng").fill("Ventolin");
  await page.getByLabel("Họ tên").fill("Nguyễn Văn A");
  await page.getByLabel("Mối quan hệ").fill("Mẹ");
  await page.getByLabel("Số điện thoại").fill("0901234567");

  await saveAndConfirm(page);

  // Reload from the mock backend (not just local component state) to prove
  // upsertRescueProfile/upsertPrimaryEmergencyContact actually persisted the
  // data, and that the edit page loads it back correctly.
  await page.reload();

  await expect(page.getByLabel("Nhóm máu")).toHaveValue("O+");
  await expect(page.getByLabel("Dị ứng")).toHaveValue("Penicillin");
  await expect(page.getByLabel("Tình trạng bệnh lý")).toHaveValue("Hen suyễn");
  await expect(page.getByLabel("Thuốc đang sử dụng")).toHaveValue("Ventolin");
  await expect(page.getByLabel("Họ tên")).toHaveValue("Nguyễn Văn A");
  await expect(page.getByLabel("Mối quan hệ")).toHaveValue("Mẹ");
  await expect(page.getByLabel("Số điện thoại")).toHaveValue("0901234567");
});

test("a personal profile never shows the rescue sections", async ({ page, context }) => {
  await signIn(context, APP_URL);
  await page.goto("/dashboard");

  // Both the header and the empty-state CTA render "Tạo hồ sơ mới" when
  // there are no cards yet -- pick the first (the header's) deterministically.
  await page.getByRole("button", { name: "Tạo hồ sơ mới" }).first().click();
  await page.getByRole("button", { name: "Hồ sơ cá nhân" }).click();
  await page.getByRole("button", { name: "Tiếp tục" }).click();

  await expect(page).toHaveURL(/\/dashboard\/edit\/.+/);
  await expect(page.getByRole("heading", { name: "Thông tin y tế" })).not.toBeVisible();
  await expect(page.getByRole("heading", { name: "Liên hệ khẩn cấp" })).not.toBeVisible();
});
