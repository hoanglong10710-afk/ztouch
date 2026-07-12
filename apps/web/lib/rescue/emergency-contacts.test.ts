import { describe, it, expect } from "vitest";
import {
  addEmergencyContact,
  deleteEmergencyContact,
  moveEmergencyContact,
  setPrimaryEmergencyContact,
} from "./emergency-contacts";
import type { EmergencyContactFormValues } from "@/lib/validation/rescue";

function makeContact(
  overrides: Partial<EmergencyContactFormValues> = {}
): EmergencyContactFormValues {
  return {
    id: null,
    fullName: "Nguyễn Văn A",
    relationship: "Mẹ",
    phone: "0901234567",
    priority: 0,
    isPrimary: false,
    ...overrides,
  };
}

describe("addEmergencyContact", () => {
  it("makes the first contact primary automatically", () => {
    const result = addEmergencyContact([]);
    expect(result).toHaveLength(1);
    expect(result[0].isPrimary).toBe(true);
    expect(result[0].priority).toBe(0);
  });

  it("does not make a second contact primary", () => {
    const first = addEmergencyContact([]);
    const second = addEmergencyContact(first);
    expect(second[1].isPrimary).toBe(false);
    expect(second[1].priority).toBe(1);
  });
});

describe("setPrimaryEmergencyContact", () => {
  it("clears the previous primary when a new one is chosen", () => {
    const contacts = [
      makeContact({ id: "a", priority: 0, isPrimary: true }),
      makeContact({ id: "b", priority: 1, isPrimary: false }),
    ];

    const result = setPrimaryEmergencyContact(contacts, 1);

    expect(result[0].isPrimary).toBe(false);
    expect(result[1].isPrimary).toBe(true);
  });

  it("never leaves more than one contact marked primary", () => {
    const contacts = [
      makeContact({ id: "a", priority: 0, isPrimary: false }),
      makeContact({ id: "b", priority: 1, isPrimary: false }),
      makeContact({ id: "c", priority: 2, isPrimary: false }),
    ];

    const result = setPrimaryEmergencyContact(contacts, 2);

    expect(result.filter((c) => c.isPrimary)).toHaveLength(1);
    expect(result[2].isPrimary).toBe(true);
  });
});

describe("deleteEmergencyContact", () => {
  it("promotes the lowest-priority remaining contact when the primary is deleted", () => {
    const contacts = [
      makeContact({ id: "a", priority: 0, isPrimary: true }),
      makeContact({ id: "b", priority: 1, isPrimary: false }),
      makeContact({ id: "c", priority: 2, isPrimary: false }),
    ];

    const result = deleteEmergencyContact(contacts, 0);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("b");
    expect(result[0].isPrimary).toBe(true);
    expect(result[1].isPrimary).toBe(false);
  });

  it("leaves no primary when deleting the primary empties the list", () => {
    const contacts = [makeContact({ id: "a", priority: 0, isPrimary: true })];

    const result = deleteEmergencyContact(contacts, 0);

    expect(result).toHaveLength(0);
  });

  it("does not change who is primary when deleting a non-primary contact", () => {
    const contacts = [
      makeContact({ id: "a", priority: 0, isPrimary: true }),
      makeContact({ id: "b", priority: 1, isPrimary: false }),
    ];

    const result = deleteEmergencyContact(contacts, 1);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("a");
    expect(result[0].isPrimary).toBe(true);
  });
});

describe("moveEmergencyContact", () => {
  it("swaps priority and position when moving a contact up", () => {
    const contacts = [
      makeContact({ id: "a", priority: 0 }),
      makeContact({ id: "b", priority: 1 }),
      makeContact({ id: "c", priority: 2 }),
    ];

    const result = moveEmergencyContact(contacts, 1, -1);

    expect(result.map((c) => c.id)).toEqual(["b", "a", "c"]);
    expect(result.map((c) => c.priority)).toEqual([0, 1, 2]);
  });

  it("swaps priority and position when moving a contact down", () => {
    const contacts = [
      makeContact({ id: "a", priority: 0 }),
      makeContact({ id: "b", priority: 1 }),
      makeContact({ id: "c", priority: 2 }),
    ];

    const result = moveEmergencyContact(contacts, 1, 1);

    expect(result.map((c) => c.id)).toEqual(["a", "c", "b"]);
    expect(result.map((c) => c.priority)).toEqual([0, 1, 2]);
  });

  it("is a no-op when moving the first contact up", () => {
    const contacts = [makeContact({ id: "a", priority: 0 }), makeContact({ id: "b", priority: 1 })];

    const result = moveEmergencyContact(contacts, 0, -1);

    expect(result).toBe(contacts);
  });

  it("is a no-op when moving the last contact down", () => {
    const contacts = [makeContact({ id: "a", priority: 0 }), makeContact({ id: "b", priority: 1 })];

    const result = moveEmergencyContact(contacts, 1, 1);

    expect(result).toBe(contacts);
  });
});
