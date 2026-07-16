import { describe, it, expect } from "vitest";
import manifest from "./manifest";

describe("manifest", () => {
  it("identifies the app with its brand name and start_url", () => {
    const result = manifest();

    expect(result.name).toBe("Z-TOUCH");
    expect(result.short_name).toBe("Z-TOUCH");
    expect(result.start_url).toBe("/");
    expect(result.display).toBe("standalone");
  });

  it("uses the documented brand colors", () => {
    const result = manifest();

    expect(result.background_color).toBe("#F8FAFC");
    expect(result.theme_color).toBe("#2563EB");
  });

  it("contains no user-specific data", () => {
    const serialized = JSON.stringify(manifest());

    expect(serialized).not.toMatch(/owner|email|phone|card_id|public_id/i);
  });

  it("lists at least one icon", () => {
    const result = manifest();

    expect(result.icons?.length).toBeGreaterThan(0);
  });
});
