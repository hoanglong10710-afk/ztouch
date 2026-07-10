// Pure classification helpers for card_views. No I/O -- every function here
// takes already-extracted request data and maps it onto the fixed enum
// values defined in supabase/migrations/20260709120000_analytics_foundation.sql.
// Keeping these pure (no Supabase, no Next.js request APIs) is what makes
// them unit-testable without mocking anything.

export type CardViewSource = "nfc" | "qr" | "link" | "unknown";

export type CardViewReferrerCategory =
  | "google"
  | "facebook"
  | "instagram"
  | "zalo"
  | "direct"
  | "other";

export type CardViewDevice = "mobile" | "desktop" | "tablet";

// Only ?src=qr and ?src=nfc are recognized. No query param at all means a
// bare/shared link. Anything else (typo, unsupported value, or the param
// repeated as an array) is classified as unknown rather than guessed at.
export function classifySource(src: string | string[] | undefined): CardViewSource {
  if (src === undefined) return "link";
  if (Array.isArray(src)) return "unknown";
  if (src === "qr") return "qr";
  if (src === "nfc") return "nfc";
  return "unknown";
}

const REFERRER_HOST_RULES: { category: CardViewReferrerCategory; pattern: RegExp }[] = [
  { category: "google", pattern: /(^|\.)google\.[a-z.]+$/i },
  { category: "facebook", pattern: /(^|\.)(facebook\.com|fb\.me)$/i },
  { category: "instagram", pattern: /(^|\.)instagram\.com$/i },
  { category: "zalo", pattern: /(^|\.)zalo(app)?\.(me|com)$/i },
];

// No Referer header means direct navigation (NFC taps and many QR scanner
// apps never send one). A header that fails to parse as a URL is "other"
// rather than "direct" -- something was sent, it just isn't a recognized
// social/search referrer.
export function classifyReferrer(referer: string | null): CardViewReferrerCategory {
  if (!referer) return "direct";

  let hostname: string;
  try {
    hostname = new URL(referer).hostname;
  } catch {
    return "other";
  }

  const match = REFERRER_HOST_RULES.find((rule) => rule.pattern.test(hostname));
  return match?.category ?? "other";
}

// Coarse device classification only -- no browser or OS detection. The
// device_type enum has no "unknown" bucket, so a missing/unrecognized
// User-Agent must still resolve to one of the three values; desktop is the
// least-presumptuous default.
const TABLET_UA_PATTERN = /iPad|Android(?!.*Mobile)/i;
const MOBILE_UA_PATTERN = /iPhone|iPod|Mobi|Android.*Mobile/i;

export function classifyDevice(userAgent: string | null): CardViewDevice {
  if (!userAgent) return "desktop";
  if (TABLET_UA_PATTERN.test(userAgent)) return "tablet";
  if (MOBILE_UA_PATTERN.test(userAgent)) return "mobile";
  return "desktop";
}
