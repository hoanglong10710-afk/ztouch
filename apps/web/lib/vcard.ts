export type VCardInput = {
  displayName: string;
  jobTitle?: string | null;
  company?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
};

// vCard 3.0 (RFC 2426) requires backslash, comma, semicolon, and embedded
// newlines to be escaped inside a value -- otherwise those characters would
// be misread as field/property separators by the parsing client.
function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\r?\n/g, "\\n");
}

// Lines must end in CRLF per RFC 2426, and only fields with a real value are
// emitted -- an empty FN/TEL/etc. line is invalid vCard, not just unsightly.
export function generateVCard(input: VCardInput): string {
  const lines = ["BEGIN:VCARD", "VERSION:3.0"];

  const displayName = input.displayName.trim();
  lines.push(`FN:${escapeVCardValue(displayName)}`);
  lines.push(`N:${escapeVCardValue(displayName)};;;;`);

  const jobTitle = input.jobTitle?.trim();
  if (jobTitle) lines.push(`TITLE:${escapeVCardValue(jobTitle)}`);

  const company = input.company?.trim();
  if (company) lines.push(`ORG:${escapeVCardValue(company)}`);

  const phone = input.phone?.trim();
  if (phone) lines.push(`TEL:${escapeVCardValue(phone)}`);

  const email = input.email?.trim();
  if (email) lines.push(`EMAIL:${escapeVCardValue(email)}`);

  const website = input.website?.trim();
  if (website) lines.push(`URL:${escapeVCardValue(website)}`);

  lines.push("END:VCARD");

  return lines.join("\r\n") + "\r\n";
}
