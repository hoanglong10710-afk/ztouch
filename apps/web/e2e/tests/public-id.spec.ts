import { test, expect } from "@playwright/test";
import { APP_URL } from "../config";
import { signIn } from "../auth";
import { resetMockData, seedCard } from "../api";
import { saveAndConfirm } from "../helpers";

test.beforeEach(async () => {
  await resetMockData();
});

test("editing the public link to a valid slug persists it", async ({ page, context }) => {
  const card = await seedCard({ title: "Hồ sơ" });
  await signIn(context, APP_URL);

  await page.goto(`/dashboard/edit/${card.id}`);

  const publicIdInput = page.getByLabel("Đường dẫn công khai");
  await publicIdInput.fill("sunpeo");

  await expect(page.getByText("https://ztouch.vn/p/sunpeo")).toBeVisible();

  await saveAndConfirm(page);

  await page.reload();
  await expect(page.getByLabel("Đường dẫn công khai")).toHaveValue("sunpeo");
});

test("an invalid slug shows a validation error and blocks saving", async ({ page, context }) => {
  const card = await seedCard({ title: "Hồ sơ" });
  await signIn(context, APP_URL);

  await page.goto(`/dashboard/edit/${card.id}`);

  const publicIdInput = page.getByLabel("Đường dẫn công khai");
  await publicIdInput.fill("not valid!!");

  const saveButton = page.getByRole("button", { name: /Lưu thay đổi/ });
  await expect(saveButton).toBeDisabled();
});

test("a reserved word slug shows a validation error and blocks saving", async ({
  page,
  context,
}) => {
  const card = await seedCard({ title: "Hồ sơ" });
  await signIn(context, APP_URL);

  await page.goto(`/dashboard/edit/${card.id}`);

  const publicIdInput = page.getByLabel("Đường dẫn công khai");
  await publicIdInput.fill("admin");

  const saveButton = page.getByRole("button", { name: /Lưu thay đổi/ });
  await expect(saveButton).toBeDisabled();
});

test("an untouched legacy public_id keeps saving other fields without a slug error", async ({
  page,
  context,
}) => {
  const card = await seedCard({ title: "Trước khi sửa" });
  await signIn(context, APP_URL);

  await page.goto(`/dashboard/edit/${card.id}`);

  await page.getByLabel("Tiêu đề").fill("Sau khi sửa");

  await saveAndConfirm(page);

  await page.reload();
  await expect(page.getByLabel("Tiêu đề")).toHaveValue("Sau khi sửa");
  await expect(page.getByLabel("Đường dẫn công khai")).toHaveValue(card.public_id);
});
