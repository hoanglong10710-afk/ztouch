import { test, expect, type Page } from "@playwright/test";
import { APP_URL } from "../config";
import { signIn } from "../auth";
import { resetMockData, seedCard } from "../api";

const WIDTHS = [360, 390, 430];

async function expectNoHorizontalOverflow(page: Page, width: number) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  expect(scrollWidth, `scrollWidth should not exceed viewport width ${width}`).toBeLessThanOrEqual(
    clientWidth
  );
}

test.beforeEach(async () => {
  await resetMockData();
});

for (const width of WIDTHS) {
  test(`login page has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/login");
    await expectNoHorizontalOverflow(page, width);
  });

  test(`dashboard (empty state) has no horizontal overflow at ${width}px`, async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await signIn(context, APP_URL);
    await page.goto("/dashboard");
    await page.getByText("Chào mừng bạn đến với Z-TOUCH").waitFor();
    await expectNoHorizontalOverflow(page, width);
  });

  test(`dashboard (with a card) has no horizontal overflow at ${width}px`, async ({
    page,
    context,
  }) => {
    const card = await seedCard({ title: "Hồ sơ test", profile_type: "rescue" });
    await page.setViewportSize({ width, height: 800 });
    await signIn(context, APP_URL);
    await page.goto("/dashboard");
    await page.getByRole("article", { name: card.title ?? "Hồ sơ test" }).waitFor();
    await expectNoHorizontalOverflow(page, width);
  });

  test(`edit page (rescue profile, with emergency contacts) has no horizontal overflow at ${width}px`, async ({
    page,
    context,
  }) => {
    const card = await seedCard({ title: "Hồ sơ cứu hộ", profile_type: "rescue" });
    await page.setViewportSize({ width, height: 800 });
    await signIn(context, APP_URL);
    await page.goto(`/dashboard/edit/${card.id}`);
    await page.getByRole("heading", { name: "Chỉnh sửa hồ sơ" }).waitFor();
    await page.getByRole("button", { name: "+ Thêm liên hệ" }).click();
    await expectNoHorizontalOverflow(page, width);
  });

  test(`public profile page has no horizontal overflow at ${width}px`, async ({ page }) => {
    const card = await seedCard({
      title: "Hồ sơ công khai",
      display_name: "Nguyễn Văn A Rất Là Dài Để Kiểm Tra Tràn Chữ",
      bio: "Đây là một đoạn giới thiệu khá dài để kiểm tra xem trang có bị tràn ngang hay không trên màn hình di động nhỏ.",
      phone: "0901234567",
      email: "test@example.com",
      website: "https://example.com",
      is_public: true,
      status: "active",
    });
    await page.setViewportSize({ width, height: 800 });
    await page.goto(`/p/${card.public_id}`);
    await expectNoHorizontalOverflow(page, width);
  });

  test(`create-profile dialog has no horizontal overflow at ${width}px`, async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await signIn(context, APP_URL);
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Tạo hồ sơ mới" }).click();
    await page.getByRole("heading", { name: "Chọn loại hồ sơ" }).waitFor();
    await expectNoHorizontalOverflow(page, width);
  });
}
