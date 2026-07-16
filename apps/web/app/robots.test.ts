import { describe, it, expect } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("allows crawling in general", () => {
    const result = robots();

    expect(result.rules).toEqual(
      expect.objectContaining({ userAgent: "*", allow: "/" })
    );
  });

  it("disallows the owner-only dashboard and auth pages", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;

    expect(rules.disallow).toEqual(["/dashboard", "/login"]);
  });

  it("does not disallow public profile pages", () => {
    const result = robots();
    const rules = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    const disallow = ([] as string[]).concat(rules.disallow ?? []);

    expect(disallow).not.toContain("/p");
  });

  it("points to the production sitemap", () => {
    const result = robots();

    expect(result.sitemap).toBe("https://ztouch.vn/sitemap.xml");
  });
});
