import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/app/p/[publicId]/data", () => ({
  listPublicCardIds: vi.fn(),
}));

import { listPublicCardIds } from "@/app/p/[publicId]/data";
import sitemap from "./sitemap";

const mockedListPublicCardIds = vi.mocked(listPublicCardIds);

describe("sitemap", () => {
  beforeEach(() => {
    mockedListPublicCardIds.mockReset();
  });

  it("always includes the home page", async () => {
    mockedListPublicCardIds.mockResolvedValue([]);

    const result = await sitemap();

    expect(result).toEqual([
      expect.objectContaining({ url: "https://ztouch.vn" }),
    ]);
  });

  it("includes one entry per public, active card, built from the existing data layer", async () => {
    mockedListPublicCardIds.mockResolvedValue([
      { publicId: "sunpeo", createdAt: "2026-01-01T00:00:00.000Z" },
      { publicId: "A1B2C3", createdAt: "2026-02-01T00:00:00.000Z" },
    ]);

    const result = await sitemap();
    const urls = result.map((entry) => entry.url);

    expect(urls).toEqual([
      "https://ztouch.vn",
      "https://ztouch.vn/p/sunpeo",
      "https://ztouch.vn/p/A1B2C3",
    ]);
  });

  it("never lists more profile URLs than listPublicCardIds returns (no private/inactive leakage)", async () => {
    mockedListPublicCardIds.mockResolvedValue([
      { publicId: "only-public-one", createdAt: "2026-01-01T00:00:00.000Z" },
    ]);

    const result = await sitemap();
    const profileUrls = result.filter((entry) => entry.url.includes("/p/"));

    expect(profileUrls).toHaveLength(1);
    expect(profileUrls[0].url).toBe("https://ztouch.vn/p/only-public-one");
  });
});
