import { test, expect } from "@playwright/test";
import { seedCard, seedRescueProfile, resetMockData } from "../api";

test.beforeEach(async () => {
  await resetMockData();
});

test("a public rescue profile renders its medical information", async ({ page }) => {
  const card = await seedCard({
    title: "Hồ sơ cứu hộ",
    profile_type: "rescue",
    is_public: true,
    status: "active",
  });

  await seedRescueProfile({
    card_id: card.id,
    blood_type: "O+",
    allergies: "Penicillin",
    medical_conditions: "Hen suyễn",
    medications: "Ventolin",
  });

  await page.goto(`/p/${card.public_id}`);

  await expect(page.getByRole("heading", { name: "Thông tin y tế" })).toBeVisible();
  await expect(page.getByText("Nhóm máu")).toBeVisible();
  await expect(page.getByText("O+")).toBeVisible();
  await expect(page.getByText("Dị ứng")).toBeVisible();
  await expect(page.getByText("Penicillin")).toBeVisible();
  await expect(page.getByText("Tình trạng bệnh lý")).toBeVisible();
  await expect(page.getByText("Hen suyễn")).toBeVisible();
  await expect(page.getByText("Thuốc đang sử dụng")).toBeVisible();
  await expect(page.getByText("Ventolin")).toBeVisible();
});

test("only fields with a value are rendered", async ({ page }) => {
  const card = await seedCard({
    title: "Hồ sơ cứu hộ",
    profile_type: "rescue",
    is_public: true,
    status: "active",
  });

  await seedRescueProfile({
    card_id: card.id,
    blood_type: "AB-",
    allergies: null,
    medical_conditions: null,
    medications: null,
  });

  await page.goto(`/p/${card.public_id}`);

  await expect(page.getByRole("heading", { name: "Thông tin y tế" })).toBeVisible();
  await expect(page.getByText("Nhóm máu")).toBeVisible();
  await expect(page.getByText("AB-")).toBeVisible();
  await expect(page.getByText("Dị ứng")).toHaveCount(0);
  await expect(page.getByText("Tình trạng bệnh lý")).toHaveCount(0);
  await expect(page.getByText("Thuốc đang sử dụng")).toHaveCount(0);
});

test("no medical info section renders when the rescue card has no rescue_profiles row", async ({
  page,
}) => {
  const card = await seedCard({
    title: "Hồ sơ cứu hộ trống",
    profile_type: "rescue",
    is_public: true,
    status: "active",
  });

  await page.goto(`/p/${card.public_id}`);

  await expect(page.getByRole("heading", { name: "Thông tin y tế" })).toHaveCount(0);
});

test("a personal profile's public page never shows the medical info section", async ({
  page,
}) => {
  const card = await seedCard({
    title: "Hồ sơ cá nhân",
    profile_type: "personal",
    is_public: true,
    status: "active",
  });

  await page.goto(`/p/${card.public_id}`);

  await expect(page.getByRole("heading", { name: "Thông tin y tế" })).toHaveCount(0);
});

test("a private rescue profile returns not-found and never leaks its medical data", async ({
  page,
}) => {
  const card = await seedCard({
    title: "Hồ sơ cứu hộ riêng tư",
    profile_type: "rescue",
    is_public: false,
    status: "active",
  });

  await seedRescueProfile({
    card_id: card.id,
    blood_type: "O+",
  });

  await page.goto(`/p/${card.public_id}`);

  await expect(page.getByRole("heading", { name: "Không tìm thấy hồ sơ" })).toBeVisible();
  await expect(page.getByText("O+")).toHaveCount(0);
});
