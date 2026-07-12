import type { EmergencyContactFormValues } from "@/lib/validation/rescue";

// Invariant maintained by every function below: `contacts` stays sorted by
// `priority` ascending, and priority always equals the element's array
// index. This lets "lowest priority" simply mean "index 0" and lets
// move-up/down be a plain adjacent-element swap.

export function createEmergencyContact(
  existing: EmergencyContactFormValues[]
): EmergencyContactFormValues {
  return {
    id: null,
    fullName: "",
    relationship: "",
    phone: "",
    priority: existing.length,
    // The first contact ever added to a card has no primary to compete
    // with, so it becomes primary automatically.
    isPrimary: existing.length === 0,
  };
}

export function addEmergencyContact(
  contacts: EmergencyContactFormValues[]
): EmergencyContactFormValues[] {
  return [...contacts, createEmergencyContact(contacts)];
}

export function setPrimaryEmergencyContact(
  contacts: EmergencyContactFormValues[],
  index: number
): EmergencyContactFormValues[] {
  return contacts.map((contact, i) => ({ ...contact, isPrimary: i === index }));
}

export function deleteEmergencyContact(
  contacts: EmergencyContactFormValues[],
  index: number
): EmergencyContactFormValues[] {
  const target = contacts[index];
  const remaining = contacts.filter((_, i) => i !== index);

  if (target?.isPrimary && remaining.length > 0) {
    remaining[0] = { ...remaining[0], isPrimary: true };
  }

  return remaining;
}

export function moveEmergencyContact(
  contacts: EmergencyContactFormValues[],
  index: number,
  direction: -1 | 1
): EmergencyContactFormValues[] {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= contacts.length) {
    return contacts;
  }

  const next = [...contacts];
  const current = next[index];
  const neighbor = next[targetIndex];

  next[index] = { ...neighbor, priority: current.priority };
  next[targetIndex] = { ...current, priority: neighbor.priority };

  return next;
}
