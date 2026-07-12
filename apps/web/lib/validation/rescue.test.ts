import { describe, it, expect } from "vitest";
import {
  validateRescueForm,
  validateEmergencyContact,
  hasErrors,
  EMPTY_RESCUE_FORM,
} from "./rescue";
import type { RescueFormValues, EmergencyContactFormValues } from "./rescue";

function makeValues(overrides: Partial<RescueFormValues> = {}): RescueFormValues {
  return {
    ...EMPTY_RESCUE_FORM,
    ...overrides,
  };
}

function makeContact(
  overrides: Partial<EmergencyContactFormValues> = {}
): EmergencyContactFormValues {
  return {
    id: null,
    fullName: "Nguyễn Văn A",
    relationship: "",
    phone: "0901234567",
    priority: 0,
    isPrimary: true,
    ...overrides,
  };
}

describe("validateRescueForm", () => {
  it.each(["bloodType", "allergies", "medicalConditions", "medications"] as const)(
    "does not require %s (medical fields are optional)",
    (field) => {
      const errors = validateRescueForm(makeValues({ [field]: "" }));
      expect(errors).toEqual({});
    }
  );
});

describe("validateEmergencyContact", () => {
  it("returns no errors when the name and phone are filled in", () => {
    expect(validateEmergencyContact(makeContact())).toEqual({});
  });

  it("requires the contact's full name", () => {
    const errors = validateEmergencyContact(makeContact({ fullName: "" }));
    expect(errors.fullName).toBeDefined();
  });

  it("requires the contact's full name to be non-whitespace", () => {
    const errors = validateEmergencyContact(makeContact({ fullName: "   " }));
    expect(errors.fullName).toBeDefined();
  });

  it("requires the contact's phone", () => {
    const errors = validateEmergencyContact(makeContact({ phone: "" }));
    expect(errors.phone).toBeDefined();
  });

  it("does not require a relationship", () => {
    const errors = validateEmergencyContact(makeContact({ relationship: "" }));
    expect(errors).toEqual({});
  });
});

describe("hasErrors", () => {
  it("returns false for an empty errors object", () => {
    expect(hasErrors({})).toBe(false);
  });

  it("returns true when at least one error exists", () => {
    expect(hasErrors({ fullName: "Trường này là bắt buộc" })).toBe(true);
  });
});
