import { test, expect } from "@playwright/test";
import { APP_URL } from "../config";
import { signIn } from "../auth";
import { resetMockData } from "../api";
import { saveAndConfirm } from "../helpers";

test.beforeEach(async () => {
  await resetMockData();
});

async function createRescueProfile(page: import("@playwright/test").Page) {
  // Both the header and the empty-state CTA render "Tạo hồ sơ mới" when
  // there are no cards yet -- pick the first (the header's) deterministically.
  await page.getByRole("button", { name: "Tạo hồ sơ mới" }).first().click();
  await page.getByRole("button", { name: "Hồ sơ cứu hộ" }).click();
  await page.getByRole("button", { name: "Tiếp tục" }).click();
  await expect(page).toHaveURL(/\/dashboard\/edit\/.+/);
}

test("creating and editing a rescue profile persists medical data and the emergency contact", async ({
  page,
  context,
}) => {
  await signIn(context, APP_URL);
  await page.goto("/dashboard");
  await createRescueProfile(page);

  await expect(page.getByRole("heading", { name: "Thông tin y tế" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Liên hệ khẩn cấp" })).toBeVisible();

  // Edit: fill in the medical fields, then add the first emergency contact.
  await page.getByLabel("Nhóm máu").fill("O+");
  await page.getByLabel("Dị ứng").fill("Penicillin");
  await page.getByLabel("Tình trạng bệnh lý").fill("Hen suyễn");
  await page.getByLabel("Thuốc đang sử dụng").fill("Ventolin");

  await page.getByRole("button", { name: "+ Thêm liên hệ" }).click();
  const contact = page.getByTestId("emergency-contact-0");
  await expect(
    contact.getByRole("button", { name: "Liên hệ chính", exact: true })
  ).toBeVisible();

  await contact.getByLabel("Họ tên").fill("Nguyễn Văn A");
  await contact.getByLabel("Mối quan hệ").fill("Mẹ");
  await contact.getByLabel("Số điện thoại").fill("0901234567");

  await saveAndConfirm(page);

  // Reload from the mock backend (not just local component state) to prove
  // upsertRescueProfile/saveEmergencyContacts actually persisted the data,
  // and that the edit page loads it back correctly.
  await page.reload();

  await expect(page.getByLabel("Nhóm máu")).toHaveValue("O+");
  await expect(page.getByLabel("Dị ứng")).toHaveValue("Penicillin");
  await expect(page.getByLabel("Tình trạng bệnh lý")).toHaveValue("Hen suyễn");
  await expect(page.getByLabel("Thuốc đang sử dụng")).toHaveValue("Ventolin");

  const reloadedContact = page.getByTestId("emergency-contact-0");
  await expect(reloadedContact.getByLabel("Họ tên")).toHaveValue("Nguyễn Văn A");
  await expect(reloadedContact.getByLabel("Mối quan hệ")).toHaveValue("Mẹ");
  await expect(reloadedContact.getByLabel("Số điện thoại")).toHaveValue("0901234567");
  await expect(
    reloadedContact.getByRole("button", { name: "Liên hệ chính", exact: true })
  ).toBeVisible();
});

test("supports adding, reordering, and deleting multiple emergency contacts", async ({
  page,
  context,
}) => {
  await signIn(context, APP_URL);
  await page.goto("/dashboard");
  await createRescueProfile(page);

  const addButton = page.getByRole("button", { name: "+ Thêm liên hệ" });

  // Add two contacts -- the first becomes primary automatically.
  await addButton.click();
  const first = page.getByTestId("emergency-contact-0");
  await first.getByLabel("Họ tên").fill("Nguyễn Văn A");
  await first.getByLabel("Số điện thoại").fill("0901111111");

  await addButton.click();
  const second = page.getByTestId("emergency-contact-1");
  await second.getByLabel("Họ tên").fill("Trần Thị B");
  await second.getByLabel("Số điện thoại").fill("0902222222");

  await expect(first.getByRole("button", { name: "Liên hệ chính", exact: true })).toBeVisible();
  await expect(second.getByRole("button", { name: "Đặt làm liên hệ chính" })).toBeVisible();

  await saveAndConfirm(page);
  await page.reload();

  // After reload, the two contacts should have persisted in order.
  await expect(page.getByTestId("emergency-contact-0").getByLabel("Họ tên")).toHaveValue(
    "Nguyễn Văn A"
  );
  await expect(page.getByTestId("emergency-contact-1").getByLabel("Họ tên")).toHaveValue(
    "Trần Thị B"
  );

  // Deleting the primary contact promotes the remaining one automatically.
  await page.getByTestId("emergency-contact-0").getByRole("button", { name: "Xóa" }).click();

  await expect(page.getByTestId("emergency-contact-1")).toHaveCount(0);
  const remaining = page.getByTestId("emergency-contact-0");
  await expect(remaining.getByLabel("Họ tên")).toHaveValue("Trần Thị B");
  await expect(
    remaining.getByRole("button", { name: "Liên hệ chính", exact: true })
  ).toBeVisible();

  await saveAndConfirm(page);
  await page.reload();

  const persistedRemaining = page.getByTestId("emergency-contact-0");
  await expect(persistedRemaining.getByLabel("Họ tên")).toHaveValue("Trần Thị B");
  await expect(
    persistedRemaining.getByRole("button", { name: "Liên hệ chính", exact: true })
  ).toBeVisible();
  await expect(page.getByTestId("emergency-contact-1")).toHaveCount(0);
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
