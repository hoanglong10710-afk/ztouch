export type RescueFormValues = {
  bloodType: string;
  allergies: string;
  medicalConditions: string;
  medications: string;
};

export const EMPTY_RESCUE_FORM: RescueFormValues = {
  bloodType: "",
  allergies: "",
  medicalConditions: "",
  medications: "",
};

export type RescueFormErrors = Record<string, never>;

// Only called when profile_type is "rescue" -- all medical fields (blood
// type, allergies, medical conditions, medications) are optional, so this
// always returns no errors today. Kept as a named validation step (rather
// than skipped entirely) so a future required medical field has a place to
// live without callers needing to change.
export function validateRescueForm(values: RescueFormValues): RescueFormErrors {
  void values;
  return {};
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some((error) => error !== undefined);
}

export type EmergencyContactFormValues = {
  id: string | null;
  fullName: string;
  relationship: string;
  phone: string;
  priority: number;
  isPrimary: boolean;
};

export type EmergencyContactFormErrors = Partial<Record<"fullName" | "phone", string>>;

const CONTACT_REQUIRED_FIELDS = ["fullName", "phone"] as const;

// Reuses the same required-fields idiom as validateRescueForm above --
// relationship stays optional, matching the DB schema (emergency_contacts.
// relationship has no NOT NULL constraint).
export function validateEmergencyContact(
  contact: EmergencyContactFormValues
): EmergencyContactFormErrors {
  const errors: EmergencyContactFormErrors = {};

  for (const field of CONTACT_REQUIRED_FIELDS) {
    if (!contact[field].trim()) {
      errors[field] = "Trường này là bắt buộc";
    }
  }

  return errors;
}
