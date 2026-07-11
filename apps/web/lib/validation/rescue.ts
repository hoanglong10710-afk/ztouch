export type RescueFormValues = {
  bloodType: string;
  allergies: string;
  medicalConditions: string;
  medications: string;
  contactFullName: string;
  contactRelationship: string;
  contactPhone: string;
};

export const EMPTY_RESCUE_FORM: RescueFormValues = {
  bloodType: "",
  allergies: "",
  medicalConditions: "",
  medications: "",
  contactFullName: "",
  contactRelationship: "",
  contactPhone: "",
};

export type RescueFormErrors = Partial<Record<"contactFullName" | "contactPhone", string>>;

const REQUIRED_FIELDS = ["contactFullName", "contactPhone"] as const;

// Only called when profile_type is "rescue" -- medical fields (blood type,
// allergies, medical conditions, medications) are always optional; only the
// primary emergency contact's name and phone are required.
export function validateRescueForm(values: RescueFormValues): RescueFormErrors {
  const errors: RescueFormErrors = {};

  for (const field of REQUIRED_FIELDS) {
    if (!values[field].trim()) {
      errors[field] = "Trường này là bắt buộc";
    }
  }

  return errors;
}

export function hasErrors(errors: RescueFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
