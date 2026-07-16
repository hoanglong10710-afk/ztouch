import { test, expect } from "@playwright/test";
import { seedCard, resetMockData } from "../api";

test.beforeEach(async () => {
  await resetMockData();
});

test("a public, active card exposes rich, indexable Open Graph metadata", async ({ page }) => {
  const card = await seedCard({
    title: "Hồ sơ cũ",
    display_name: "Nguyễn Văn A",
    bio: "Xin chào, đây là hồ sơ công khai của tôi.",
    avatar_url: "https://placehold.co/200x200.png",
    is_public: true,
    status: "active",
  });

  await page.goto(`/p/${card.public_id}`);

  await expect(page).toHaveTitle("Nguyễn Văn A");

  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "Nguyễn Văn A"
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    "Xin chào, đây là hồ sơ công khai của tôi."
  );
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
    "content",
    "Nguyễn Văn A"
  );

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `https://ztouch.vn/p/${card.public_id}`
  );

  const robotsContent = await page.locator('meta[name="robots"]').getAttribute("content");
  expect(robotsContent).toContain("index");
  expect(robotsContent).toContain("follow");
  expect(robotsContent).not.toContain("noindex");
});

test("a missing profile is marked noindex and doesn't leak profile details", async ({ page }) => {
  await page.goto("/p/does-not-exist");

  await expect(page).toHaveTitle("Không tìm thấy hồ sơ");

  const robotsContent = await page.locator('meta[name="robots"]').first().getAttribute("content");
  expect(robotsContent).toContain("noindex");

  await expect(page.locator('meta[property="og:title"]')).toHaveCount(0);
});

test("a private card resolves the same noindex metadata as a missing profile", async ({
  page,
}) => {
  const card = await seedCard({ title: "Hồ sơ riêng tư", is_public: false });

  await page.goto(`/p/${card.public_id}`);

  await expect(page).toHaveTitle("Không tìm thấy hồ sơ");

  const robotsContent = await page.locator('meta[name="robots"]').first().getAttribute("content");
  expect(robotsContent).toContain("noindex");
});
