import { test, expect } from "@playwright/test";
import { seedCard, resetMockData } from "../api";

test.beforeEach(async () => {
  await resetMockData();
});

test("phone, email, and website rows each show a copy button that copies without navigating", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);

  const card = await seedCard({
    title: "Nguyễn Văn A",
    display_name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "a@example.com",
    website: "https://example.com",
    is_public: true,
    status: "active",
  });

  await page.goto(`/p/${card.public_id}`);

  await expect(page.getByRole("button", { name: "Sao chép số điện thoại" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sao chép email" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sao chép đường dẫn website" })).toBeVisible();

  // The underlying tel:/mailto:/website links must still work -- copy is additive.
  await expect(page.getByRole("link", { name: "Gọi điện thoại: 0901234567" })).toHaveAttribute(
    "href",
    "tel:0901234567"
  );

  await page.getByRole("button", { name: "Sao chép số điện thoại" }).click();
  await expect(page).toHaveURL(new RegExp(`/p/${card.public_id}$`));
  await expect(page.getByRole("button", { name: "Đã sao chép" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("0901234567");

  await page.getByRole("button", { name: "Sao chép email" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("a@example.com");

  await page.getByRole("button", { name: "Sao chép đường dẫn website" }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("https://example.com");
});

test("tab order moves through each contact link and its copy button without skipping or trapping", async ({
  page,
}) => {
  const card = await seedCard({
    title: "Nguyễn Văn A",
    display_name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "a@example.com",
    is_public: true,
    status: "active",
  });

  await page.goto(`/p/${card.public_id}`);

  const expectedOrder = [
    "Gọi điện thoại: 0901234567",
    "Sao chép số điện thoại",
    "Gửi email: a@example.com",
    "Sao chép email",
    "Lưu danh bạ của Nguyễn Văn A về máy dưới dạng file .vcf",
  ];

  for (const name of expectedOrder) {
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveAccessibleName(name);
  }
});

test("a card with no phone, email, or website still shows only the vcard row", async ({
  page,
}) => {
  const card = await seedCard({
    title: "Nguyễn Văn A",
    display_name: "Nguyễn Văn A",
    is_public: true,
    status: "active",
  });

  await page.goto(`/p/${card.public_id}`);

  await expect(page.getByRole("button", { name: /^Sao chép/ })).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Lưu danh bạ/ })).toBeVisible();
});
