import { describe, it, expect } from "vitest";
import { validateCard, hasErrors } from "./card";
import type { Card } from "@/types/card";

function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    id: "card-1",
    owner_id: "owner-1",
    public_id: "ABC123",
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

describe("validateCard", () => {
  it("returns no errors for a minimally valid card", () => {
    expect(validateCard(makeCard())).toEqual({});
  });

  it("requires title", () => {
    const errors = validateCard(makeCard({ title: "" }));
    expect(errors.title).toBeDefined();
  });

  it("requires title to be non-whitespace", () => {
    const errors = validateCard(makeCard({ title: "   " }));
    expect(errors.title).toBeDefined();
  });

  it("allows an empty email (optional field)", () => {
    const errors = validateCard(makeCard({ email: "" }));
    expect(errors.email).toBeUndefined();
  });

  it("rejects an invalid email", () => {
    const errors = validateCard(makeCard({ email: "not-an-email" }));
    expect(errors.email).toBeDefined();
  });

  it("accepts a valid email", () => {
    const errors = validateCard(makeCard({ email: "a@b.com" }));
    expect(errors.email).toBeUndefined();
  });

  it.each([
    "avatar_url",
    "website",
    "facebook",
    "tiktok",
    "youtube",
    "instagram",
    "linkedin",
    "github",
  ] as const)("allows an empty %s (optional field)", (field) => {
    const errors = validateCard(makeCard({ [field]: "" }));
    expect(errors[field]).toBeUndefined();
  });

  it.each([
    "avatar_url",
    "website",
    "facebook",
    "tiktok",
    "youtube",
    "instagram",
    "linkedin",
    "github",
  ] as const)("rejects a non-http(s) %s url", (field) => {
    const errors = validateCard(makeCard({ [field]: "javascript:alert(1)" }));
    expect(errors[field]).toBeDefined();
  });

  it.each([
    "avatar_url",
    "website",
    "facebook",
    "tiktok",
    "youtube",
    "instagram",
    "linkedin",
    "github",
  ] as const)("accepts a valid https %s url", (field) => {
    const errors = validateCard(makeCard({ [field]: "https://example.com" }));
    expect(errors[field]).toBeUndefined();
  });
});

describe("hasErrors", () => {
  it("returns false for an empty errors object", () => {
    expect(hasErrors({})).toBe(false);
  });

  it("returns true when at least one error exists", () => {
    expect(hasErrors({ title: "Trường này là bắt buộc" })).toBe(true);
  });
});
