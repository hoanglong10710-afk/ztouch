import { describe, it, expect } from "vitest";
import { validatePublicId, PUBLIC_ID_RESERVED_WORDS } from "./public-id";

describe("validatePublicId", () => {
  it("accepts a simple lowercase slug", () => {
    expect(validatePublicId("long")).toBeUndefined();
  });

  it("accepts digits and hyphens", () => {
    expect(validatePublicId("nguyen-van-a")).toBeUndefined();
    expect(validatePublicId("sunpeo")).toBeUndefined();
    expect(validatePublicId("user123")).toBeUndefined();
  });

  it("rejects an empty value", () => {
    expect(validatePublicId("")).toBeDefined();
    expect(validatePublicId("   ")).toBeDefined();
  });

  it("rejects values shorter than 3 characters", () => {
    expect(validatePublicId("ab")).toBeDefined();
  });

  it("accepts a value exactly 3 characters long", () => {
    expect(validatePublicId("abc")).toBeUndefined();
  });

  it("rejects values longer than 30 characters", () => {
    expect(validatePublicId("a".repeat(31))).toBeDefined();
  });

  it("accepts a value exactly 30 characters long", () => {
    expect(validatePublicId("a".repeat(30))).toBeUndefined();
  });

  it("rejects uppercase letters", () => {
    expect(validatePublicId("Long")).toBeDefined();
    expect(validatePublicId("LONG")).toBeDefined();
  });

  it("rejects spaces", () => {
    expect(validatePublicId("long nguyen")).toBeDefined();
  });

  it("rejects Vietnamese characters", () => {
    expect(validatePublicId("nguyễn")).toBeDefined();
    expect(validatePublicId("longg")).toBeUndefined();
    expect(validatePublicId("hoà")).toBeDefined();
  });

  it("rejects duplicated hyphens", () => {
    expect(validatePublicId("long--nguyen")).toBeDefined();
  });

  it("rejects a leading hyphen", () => {
    expect(validatePublicId("-long")).toBeDefined();
  });

  it("rejects a trailing hyphen", () => {
    expect(validatePublicId("long-")).toBeDefined();
  });

  it("rejects other special characters", () => {
    expect(validatePublicId("long_nguyen")).toBeDefined();
    expect(validatePublicId("long.nguyen")).toBeDefined();
    expect(validatePublicId("long@nguyen")).toBeDefined();
  });

  it.each(PUBLIC_ID_RESERVED_WORDS)("rejects the reserved word %s", (word) => {
    expect(validatePublicId(word)).toBeDefined();
  });
});
