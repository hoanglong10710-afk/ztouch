// Canonical production domain used to build absolute URLs (canonical links,
// Open Graph URLs) from Server Components, where window.location isn't
// available. See docs/00_PROJECT_CONTEXT.md and docs/06_DATABASE.md for the
// ztouch.vn domain as the documented production URL.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ztouch.vn";
