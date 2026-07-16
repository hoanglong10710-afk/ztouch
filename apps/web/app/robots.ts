import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// /dashboard and /login are owner/auth-only surfaces with no value to a
// crawler (gated client-side per lib/supabase/client.ts usage, not by
// middleware) -- excluding them keeps the index focused on public profiles.
// Individual /p/[publicId] pages carry their own per-card robots meta tag
// (see lib/public-profile-metadata.ts) for private/missing profiles, so this
// file only needs to allow the route in general.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/login"],
    },
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
  };
}
