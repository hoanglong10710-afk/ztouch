import { test, expect } from "@playwright/test";
import { seedCard, resetMockData } from "../api";

test.beforeEach(async () => {
  await resetMockData();
});

test("robots.txt allows public pages, disallows the dashboard/login, and points to the sitemap", async ({
  request,
}) => {
  const response = await request.get("/robots.txt");

  expect(response.status()).toBe(200);

  const body = await response.text();
  expect(body).toContain("Allow: /");
  expect(body).toContain("Disallow: /dashboard");
  expect(body).toContain("Disallow: /login");
  expect(body).toContain("Sitemap: https://ztouch.vn/sitemap.xml");
});

test("manifest.webmanifest describes the app with no user data", async ({ request }) => {
  const response = await request.get("/manifest.webmanifest");

  expect(response.status()).toBe(200);

  const manifest = await response.json();
  expect(manifest.name).toBe("Z-TOUCH");
  expect(manifest.start_url).toBe("/");
  expect(manifest.icons.length).toBeGreaterThan(0);
});

test("sitemap.xml lists public, active cards but never a private one", async ({ request }) => {
  const publicCard = await seedCard({
    title: "Hồ sơ công khai",
    public_id: "sunpeo",
    is_public: true,
    status: "active",
  });
  const privateCard = await seedCard({
    title: "Hồ sơ riêng tư",
    public_id: "bi-mat-rieng-tu",
    is_public: false,
  });
  const inactiveCard = await seedCard({
    title: "Hồ sơ ngưng hoạt động",
    public_id: "ngung-hoat-dong",
    status: "inactive",
  });

  const response = await request.get("/sitemap.xml");

  expect(response.status()).toBe(200);

  const body = await response.text();
  expect(body).toContain(`https://ztouch.vn/p/${publicCard.public_id}`);
  expect(body).not.toContain(privateCard.public_id);
  expect(body).not.toContain(inactiveCard.public_id);
});
