import { describe, it, expect } from "vitest";
import { generateVCard } from "./vcard";

describe("generateVCard", () => {
  it("includes only FN/N when no optional fields are given", () => {
    const vcard = generateVCard({ displayName: "Nguyễn Văn A" });

    expect(vcard).toBe(
      "BEGIN:VCARD\r\n" +
        "VERSION:3.0\r\n" +
        "FN:Nguyễn Văn A\r\n" +
        "N:Nguyễn Văn A;;;;\r\n" +
        "END:VCARD\r\n"
    );
  });

  it("includes every field when all are present", () => {
    const vcard = generateVCard({
      displayName: "Trần Thị B",
      jobTitle: "Kỹ sư",
      company: "Z-TOUCH",
      phone: "0901234567",
      email: "b@example.com",
      website: "https://example.com",
    });

    expect(vcard.split("\r\n")).toEqual([
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN:Trần Thị B",
      "N:Trần Thị B;;;;",
      "TITLE:Kỹ sư",
      "ORG:Z-TOUCH",
      "TEL:0901234567",
      "EMAIL:b@example.com",
      "URL:https://example.com",
      "END:VCARD",
      "",
    ]);
  });

  it("omits fields that are null, undefined, or blank", () => {
    const vcard = generateVCard({
      displayName: "Lê Văn C",
      jobTitle: null,
      company: undefined,
      phone: "   ",
      email: "",
      website: undefined,
    });

    expect(vcard).toBe(
      "BEGIN:VCARD\r\n" + "VERSION:3.0\r\n" + "FN:Lê Văn C\r\n" + "N:Lê Văn C;;;;\r\n" + "END:VCARD\r\n"
    );
  });

  it("produces no empty lines", () => {
    const vcard = generateVCard({ displayName: "D" });
    const lines = vcard.split("\r\n").slice(0, -1);

    expect(lines.every((line) => line.length > 0)).toBe(true);
  });

  it("escapes backslash, comma, semicolon, and newline in values", () => {
    const vcard = generateVCard({
      displayName: "A, B; C\\D\nE",
      company: "Co\\Corp",
    });

    expect(vcard).toContain("FN:A\\, B\\; C\\\\D\\nE\r\n");
    expect(vcard).toContain("ORG:Co\\\\Corp\r\n");
  });
});
