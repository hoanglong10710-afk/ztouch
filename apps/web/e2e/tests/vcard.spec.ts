import { test, expect } from "@playwright/test";
import { seedCard, resetMockData } from "../api";

test.beforeEach(async () => {
  await resetMockData();
});

test("a public profile shows a download-contact button linking to the vcard route", async ({
  page,
}) => {
  const card = await seedCard({
    title: "Nguyễn Văn A",
    display_name: "Nguyễn Văn A",
    is_public: true,
    status: "active",
  });

  await page.goto(`/p/${card.public_id}`);

  const button = page.getByRole("link", { name: "Lưu danh bạ" });
  await expect(button).toBeVisible();
  await expect(button).toHaveAttribute("href", `/p/${card.public_id}/vcard`);
  await expect(button).toHaveAttribute("download", "");
});

test("the vcard route returns a valid vCard for a public, active card", async ({ request }) => {
  const card = await seedCard({
    title: "Trần Thị B",
    display_name: "Trần Thị B",
    job_title: "Kỹ sư",
    company: "Z-TOUCH",
    phone: "0901234567",
    email: "b@example.com",
    website: "https://example.com",
    is_public: true,
    status: "active",
  });

  const response = await request.get(`/p/${card.public_id}/vcard`);

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/vcard");
  expect(response.headers()["content-disposition"]).toContain("attachment");
  expect(response.headers()["content-disposition"]).toContain(".vcf");

  const body = await response.text();
  expect(body).toContain("BEGIN:VCARD");
  expect(body).toContain("VERSION:3.0");
  expect(body).toContain("FN:Tr");
  expect(body).toContain("TITLE:K");
  expect(body).toContain("ORG:Z-TOUCH");
  expect(body).toContain("TEL:0901234567");
  expect(body).toContain("EMAIL:b@example.com");
  expect(body).toContain("URL:https://example.com");
  expect(body).toContain("END:VCARD");
});

test("the vcard route 404s for a private card", async ({ request }) => {
  const card = await seedCard({
    title: "Hồ sơ riêng tư",
    is_public: false,
  });

  const response = await request.get(`/p/${card.public_id}/vcard`);

  expect(response.status()).toBe(404);
});

test("the vcard route 404s for an unknown public id", async ({ request }) => {
  const response = await request.get("/p/does-not-exist/vcard");

  expect(response.status()).toBe(404);
});
