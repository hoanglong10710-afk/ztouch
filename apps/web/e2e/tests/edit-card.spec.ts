import { test, expect } from "@playwright/test";
import { APP_URL } from "../config";
import { signIn } from "../auth";
import { resetMockData, seedCard } from "../api";
import { saveAndConfirm } from "../helpers";

test.beforeEach(async () => {
  await resetMockData();
});

test("editing a card persists the new title", async ({ page, context }) => {
  const card = await seedCard({ title: "Trước khi sửa" });
  await signIn(context, APP_URL);

  await page.goto(`/dashboard/edit/${card.id}`);

  const titleInput = page.getByLabel("Tiêu đề");
  await titleInput.fill("Sau khi sửa");

  await saveAndConfirm(page);

  // Reload from the mock backend (not just local component state) to prove
  // the Server Action actually persisted the change.
  await page.reload();
  await expect(page.getByLabel("Tiêu đề")).toHaveValue("Sau khi sửa");
});

test("switching profile type from Personal to Rescue reveals and persists rescue sections", async ({
  page,
  context,
}) => {
  const card = await seedCard({ profile_type: "personal" });
  await signIn(context, APP_URL);

  await page.goto(`/dashboard/edit/${card.id}`);

  await expect(page.getByRole("heading", { name: "Thông tin y tế" })).not.toBeVisible();

  await page.getByRole("radio", { name: /Cứu hộ/ }).click();
  await expect(page.getByRole("heading", { name: "Thông tin y tế" })).toBeVisible();

  await saveAndConfirm(page);
  await page.reload();

  await expect(page.getByRole("radio", { name: /Cứu hộ/ })).toHaveAttribute(
    "aria-checked",
    "true"
  );
  await expect(page.getByRole("heading", { name: "Thông tin y tế" })).toBeVisible();
});

test("switching profile type from Rescue back to Personal hides rescue sections", async ({
  page,
  context,
}) => {
  const card = await seedCard({ profile_type: "rescue" });
  await signIn(context, APP_URL);

  await page.goto(`/dashboard/edit/${card.id}`);

  await expect(page.getByRole("heading", { name: "Thông tin y tế" })).toBeVisible();

  await page.getByRole("radio", { name: /Cá nhân/ }).click();
  await expect(page.getByRole("heading", { name: "Thông tin y tế" })).not.toBeVisible();

  await saveAndConfirm(page);
  await page.reload();

  await expect(page.getByRole("radio", { name: /Cá nhân/ })).toHaveAttribute(
    "aria-checked",
    "true"
  );
  await expect(page.getByRole("heading", { name: "Thông tin y tế" })).not.toBeVisible();
});
