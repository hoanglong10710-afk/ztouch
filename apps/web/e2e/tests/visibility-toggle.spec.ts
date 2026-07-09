import { test, expect } from "@playwright/test";
import { APP_URL } from "../config";
import { signIn } from "../auth";
import { resetMockData, seedCard } from "../api";
import { saveAndConfirm } from "../helpers";

test.beforeEach(async () => {
  await resetMockData();
});

test("toggling a card private hides it from the public route, toggling back restores it", async ({
  page,
  context,
  browser,
}) => {
  const card = await seedCard({ title: "Hồ sơ công khai", is_public: true });
  await signIn(context, APP_URL);

  await page.goto(`/dashboard/edit/${card.id}`);

  // A separate, unauthenticated context stands in for a public visitor
  // scanning the NFC/QR link.
  const visitorContext = await browser.newContext();
  const visitorPage = await visitorContext.newPage();

  await visitorPage.goto(`${APP_URL}/p/${card.public_id}`);
  await expect(visitorPage.getByRole("heading", { name: "Hồ sơ công khai" })).toBeVisible();

  await page.getByRole("switch", { name: "Công khai hồ sơ" }).click();
  await saveAndConfirm(page);

  await visitorPage.reload();
  await expect(visitorPage.getByRole("heading", { name: "Không tìm thấy hồ sơ" })).toBeVisible();

  await page.getByRole("switch", { name: "Công khai hồ sơ" }).click();
  await saveAndConfirm(page);

  await visitorPage.reload();
  await expect(visitorPage.getByRole("heading", { name: "Hồ sơ công khai" })).toBeVisible();

  await visitorContext.close();
});
