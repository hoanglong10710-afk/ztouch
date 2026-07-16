import { describe, it, expect } from "vitest";
import { buildPublicProfileMetadata, notFoundProfileMetadata } from "./public-profile-metadata";
import type { Card } from "@/types/card";

function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    id: "card-1",
    owner_id: "owner-1",
    public_id: "sunpeo",
    profile_type: "personal",
    status: "active",
    is_public: true,
    title: "Hồ sơ mới",
    display_name: null,
    job_title: null,
    company: null,
    bio: null,
    avatar_url: null,
    phone: null,
    email: null,
    website: null,
    facebook: null,
    tiktok: null,
    youtube: null,
    instagram: null,
    linkedin: null,
    github: null,
    address: null,
    created_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("buildPublicProfileMetadata", () => {
  it("prefers display_name and bio when present", () => {
    const card = makeCard({
      display_name: "Nguyễn Văn A",
      title: "Hồ sơ cũ",
      bio: "Xin chào!",
      job_title: "Kỹ sư",
    });

    const metadata = buildPublicProfileMetadata(card, "sunpeo");

    expect(metadata.title).toBe("Nguyễn Văn A");
    expect(metadata.description).toBe("Xin chào!");
    expect(metadata.openGraph?.title).toBe("Nguyễn Văn A");
    expect(metadata.openGraph?.description).toBe("Xin chào!");
    expect(metadata.twitter?.title).toBe("Nguyễn Văn A");
    expect(metadata.twitter?.description).toBe("Xin chào!");
  });

  it("falls back to title when display_name is missing", () => {
    const card = makeCard({ display_name: null, title: "Hồ sơ cũ" });

    const metadata = buildPublicProfileMetadata(card, "sunpeo");

    expect(metadata.title).toBe("Hồ sơ cũ");
  });

  it("falls back to job_title when bio is missing", () => {
    const card = makeCard({ bio: null, job_title: "Kỹ sư" });

    const metadata = buildPublicProfileMetadata(card, "sunpeo");

    expect(metadata.description).toBe("Kỹ sư");
  });

  it("falls back to generic copy when everything is missing", () => {
    const card = makeCard({ display_name: null, title: null, bio: null, job_title: null });

    const metadata = buildPublicProfileMetadata(card, "sunpeo");

    expect(metadata.title).toBe("Hồ sơ Z-TOUCH");
    expect(metadata.description).toBe("Hồ sơ số Z-TOUCH");
  });

  it("builds an absolute canonical URL and matching openGraph url from the public_id", () => {
    const card = makeCard();

    const metadata = buildPublicProfileMetadata(card, "sunpeo");

    expect(metadata.alternates?.canonical).toBe("https://ztouch.vn/p/sunpeo");
    expect(metadata.openGraph?.url).toBe("https://ztouch.vn/p/sunpeo");
  });

  it("marks a resolved public profile as indexable", () => {
    const metadata = buildPublicProfileMetadata(makeCard(), "sunpeo");

    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it("includes a safe https avatar as the og/twitter image", () => {
    const card = makeCard({ avatar_url: "https://cdn.example.com/avatar.png" });

    const metadata = buildPublicProfileMetadata(card, "sunpeo");

    expect(metadata.openGraph?.images).toEqual(["https://cdn.example.com/avatar.png"]);
    expect(metadata.twitter?.images).toEqual(["https://cdn.example.com/avatar.png"]);
  });

  it("omits the image when there is no avatar_url", () => {
    const card = makeCard({ avatar_url: null });

    const metadata = buildPublicProfileMetadata(card, "sunpeo");

    expect(metadata.openGraph?.images).toBeUndefined();
    expect(metadata.twitter?.images).toBeUndefined();
  });

  it("omits the image for an unsafe (non-http/https) avatar_url", () => {
    const card = makeCard({ avatar_url: "javascript:alert(1)" });

    const metadata = buildPublicProfileMetadata(card, "sunpeo");

    expect(metadata.openGraph?.images).toBeUndefined();
    expect(metadata.twitter?.images).toBeUndefined();
  });

  it("never includes owner-only fields (email, phone, owner_id) in the metadata output", () => {
    const card = makeCard({
      email: "owner@example.com",
      phone: "0900000000",
      owner_id: "super-secret-owner-id",
    });

    const metadata = buildPublicProfileMetadata(card, "sunpeo");
    const serialized = JSON.stringify(metadata);

    expect(serialized).not.toContain("owner@example.com");
    expect(serialized).not.toContain("0900000000");
    expect(serialized).not.toContain("super-secret-owner-id");
  });
});

describe("notFoundProfileMetadata", () => {
  it("returns a generic title and marks the page as non-indexable", () => {
    const metadata = notFoundProfileMetadata();

    expect(metadata.title).toBe("Không tìm thấy hồ sơ");
    expect(metadata.robots).toEqual({ index: false });
  });
});
