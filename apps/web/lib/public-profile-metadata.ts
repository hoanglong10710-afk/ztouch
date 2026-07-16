import type { Metadata } from "next";
import type { Card } from "@/types/card";
import { SITE_URL } from "@/lib/site";

function isSafeUrl(value: string | null): value is string {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Metadata for a public_id that doesn't resolve to a visible card (never
// existed, private, inactive) -- deliberately identical regardless of which
// of those it is, so the metadata never reveals whether a profile once
// existed. Excluded from search indexes since there's nothing to show.
export function notFoundProfileMetadata(): Metadata {
  return {
    title: "Không tìm thấy hồ sơ",
    robots: { index: false },
  };
}

// Builds metadata purely from what's already rendered on the public profile
// page itself (name, bio/job title, avatar) -- never from owner-only fields
// like email, phone, or rescue data, so the social preview can't leak
// anything the page doesn't already show.
export function buildPublicProfileMetadata(card: Card, publicId: string): Metadata {
  const name = card.display_name || card.title || "Hồ sơ Z-TOUCH";
  const description = card.bio || card.job_title || "Hồ sơ số Z-TOUCH";
  const canonicalPath = `/p/${publicId}`;
  const canonicalUrl = new URL(canonicalPath, SITE_URL).toString();
  const images = isSafeUrl(card.avatar_url) ? [card.avatar_url] : undefined;

  return {
    title: name,
    description,
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true },
    openGraph: {
      title: name,
      description,
      type: "profile",
      url: canonicalUrl,
      images,
    },
    twitter: {
      card: "summary",
      title: name,
      description,
      images,
    },
  };
}
