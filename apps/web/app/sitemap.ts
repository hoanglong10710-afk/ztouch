import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { listPublicCardIds } from "@/app/p/[publicId]/data";

// Mirrors the public profile page's own force-dynamic setting (see
// app/p/[publicId]/page.tsx): a card that goes private or inactive after
// this sitemap was last generated must stop appearing in it, so the route
// can't be treated as a cacheable/static file.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cards = await listPublicCardIds();

  const profileEntries: MetadataRoute.Sitemap = cards.map(({ publicId, createdAt }) => ({
    url: new URL(`/p/${publicId}`, SITE_URL).toString(),
    lastModified: createdAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...profileEntries,
  ];
}
