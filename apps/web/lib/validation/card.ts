import type { Card, CardStringField } from "@/types/card";

export type CardFormErrors = Partial<Record<CardStringField, string>>;

const REQUIRED_FIELDS: CardStringField[] = ["title"];

const URL_FIELDS: CardStringField[] = [
  "avatar_url",
  "website",
  "facebook",
  "tiktok",
  "youtube",
  "instagram",
  "linkedin",
  "github",
];

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateCard(card: Card): CardFormErrors {
  const errors: CardFormErrors = {};

  for (const field of REQUIRED_FIELDS) {
    if (!card[field] || !card[field]!.trim()) {
      errors[field] = "Trường này là bắt buộc";
    }
  }

  const email = card.email?.trim();
  if (email && !isValidEmail(email)) {
    errors.email = "Email không hợp lệ";
  }

  for (const field of URL_FIELDS) {
    const value = card[field]?.trim();
    if (value && !isValidUrl(value)) {
      errors[field] = "Đường dẫn không hợp lệ (phải bắt đầu bằng http:// hoặc https://)";
    }
  }

  return errors;
}

export function hasErrors(errors: CardFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
