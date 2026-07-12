import { test, expect } from "@playwright/test";
import { seedCard, seedEmergencyContact, resetMockData } from "../api";

test.beforeEach(async () => {
  await resetMockData();
});

test("a public rescue profile shows only the primary emergency contact", async ({ page }) => {
  const card = await seedCard({
    title: "Hồ sơ cứu hộ",
    profile_type: "rescue",
    is_public: true,
    status: "active",
  });

  await seedEmergencyContact({
    card_id: card.id,
    full_name: "Nguyễn Văn A",
    relationship: "Mẹ",
    phone: "0901111111",
    priority: 0,
    is_primary: true,
  });

  await seedEmergencyContact({
    card_id: card.id,
    full_name: "Trần Thị B",
    relationship: "Bạn thân",
    phone: "0902222222",
    priority: 1,
    is_primary: false,
  });

  await page.goto(`/p/${card.public_id}`);

  await expect(page.getByText("Nguyễn Văn A")).toBeVisible();
  await expect(page.getByText("Mẹ")).toBeVisible();
  await expect(page.getByRole("link", { name: "Gọi ngay" })).toHaveAttribute(
    "href",
    "tel:0901111111"
  );

  // The secondary contact must never appear anywhere on the page.
  await expect(page.getByText("Trần Thị B")).toHaveCount(0);
  await expect(page.getByText("Bạn thân")).toHaveCount(0);
  await expect(page.getByText("0902222222")).toHaveCount(0);
});

test("a personal profile's public page never shows an emergency contact block", async ({
  page,
}) => {
  const card = await seedCard({
    title: "Hồ sơ cá nhân",
    profile_type: "personal",
    is_public: true,
    status: "active",
  });

  await page.goto(`/p/${card.public_id}`);

  await expect(page.getByRole("link", { name: "Gọi ngay" })).toHaveCount(0);
});

test("a private rescue profile returns not-found and never leaks its contact", async ({
  page,
}) => {
  const card = await seedCard({
    title: "Hồ sơ cứu hộ riêng tư",
    profile_type: "rescue",
    is_public: false,
    status: "active",
  });

  await seedEmergencyContact({
    card_id: card.id,
    full_name: "Nguyễn Văn A",
    phone: "0901111111",
    priority: 0,
    is_primary: true,
  });

  await page.goto(`/p/${card.public_id}`);

  await expect(page.getByRole("heading", { name: "Không tìm thấy hồ sơ" })).toBeVisible();
  await expect(page.getByText("Nguyễn Văn A")).toHaveCount(0);
});
