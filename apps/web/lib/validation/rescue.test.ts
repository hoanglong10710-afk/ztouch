import { describe, it, expect } from "vitest";
import { validateRescueForm, hasErrors, EMPTY_RESCUE_FORM } from "./rescue";
import type { RescueFormValues } from "./rescue";

function makeValues(overrides: Partial<RescueFormValues> = {}): RescueFormValues {
  return {
    ...EMPTY_RESCUE_FORM,
    contactFullName: "Nguyễn Văn A",
    contactPhone: "0901234567",
    ...overrides,
  };
}

describe("validateRescueForm", () => {
  it("returns no errors when the contact name and phone are filled in", () => {
    expect(validateRescueForm(makeValues())).toEqual({});
  });

  it("requires the emergency contact's full name", () => {
    const errors = validateRescueForm(makeValues({ contactFullName: "" }));
    expect(errors.contactFullName).toBeDefined();
  });

  it("requires the emergency contact's full name to be non-whitespace", () => {
    const errors = validateRescueForm(makeValues({ contactFullName: "   " }));
    expect(errors.contactFullName).toBeDefined();
  });

  it("requires the emergency contact's phone", () => {
    const errors = validateRescueForm(makeValues({ contactPhone: "" }));
    expect(errors.contactPhone).toBeDefined();
  });

  it("does not require a relationship", () => {
    const errors = validateRescueForm(makeValues({ contactRelationship: "" }));
    expect(errors).toEqual({});
  });

  it.each(["bloodType", "allergies", "medicalConditions", "medications"] as const)(
    "does not require %s (medical fields are optional)",
    (field) => {
      const errors = validateRescueForm(makeValues({ [field]: "" }));
      expect(errors).toEqual({});
    }
  );
});

describe("hasErrors", () => {
  it("returns false for an empty errors object", () => {
    expect(hasErrors({})).toBe(false);
  });

  it("returns true when at least one error exists", () => {
    expect(hasErrors({ contactFullName: "Trường này là bắt buộc" })).toBe(true);
  });
});
