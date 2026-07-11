import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { after } from "next/server";
import { Phone, Mail, Globe } from "lucide-react";
import type { Metadata } from "next";
import ProfileHeader from "@/components/public/ProfileHeader";
import InfoButton from "@/components/public/InfoButton";
import SocialButton from "@/components/public/SocialButton";
import { getCardByPublicId } from "./data";
import { createServerSupabase } from "@/lib/supabase/server";
import { recordCardView } from "@/lib/analytics/record-card-view";
import type { CardStringField } from "@/types/card";

// Without this, Next.js's fetch cache can serve a stale card (e.g. after an
// owner edits their profile or toggles visibility) until an unrelated
// revalidation happens to occur — this route must always reflect current data.
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    publicId: string;
  }>;
  searchParams: Promise<{
    src?: string | string[];
  }>;
};

function isSafeUrl(value: string | null): value is string {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const SOCIAL_LINKS: { key: CardStringField; label: string }[] = [
  { key: "facebook", label: "Facebook" },
  { key: "tiktok", label: "TikTok" },
  { key: "youtube", label: "YouTube" },
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { publicId } = await params;
  const { card, error } = await getCardByPublicId(publicId);

  if (error || !card) {
    return { title: "Không tìm thấy hồ sơ" };
  }

  const name = card.display_name || card.title || "Hồ sơ Z-TOUCH";
  const description = card.bio || card.job_title || "Hồ sơ số Z-TOUCH";

  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      type: "profile",
      images: isSafeUrl(card.avatar_url) ? [card.avatar_url] : undefined,
    },
    twitter: {
      card: "summary",
      title: name,
      description,
      images: isSafeUrl(card.avatar_url) ? [card.avatar_url] : undefined,
    },
  };
}

export default async function PublicPage({ params, searchParams }: Props) {
  const { publicId } = await params;
  const { card, error } = await getCardByPublicId(publicId);

  if (error) {
    throw new Error(error.message);
  }

  if (!card) {
    notFound();
  }

  // Request data must be read here, during render — after() cannot call
  // cookies()/headers() itself from inside a Server Component (see
  // lib/analytics/record-card-view.ts for why a client built from cookies()
  // is passed in rather than constructed inside the callback).
  const { src } = await searchParams;
  const requestHeaders = await headers();
  const referer = requestHeaders.get("referer");
  const userAgent = requestHeaders.get("user-agent");
  const supabase = await createServerSupabase();

  after(() => recordCardView(supabase, { cardId: card.id, src, referer, userAgent }));

  return (
    <main className="min-h-screen bg-muted">
      <div className="mx-auto max-w-xl p-4 sm:p-8">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
          <ProfileHeader
            name={card.display_name || card.title || ""}
            jobTitle={card.job_title}
            bio={card.bio}
            avatarUrl={isSafeUrl(card.avatar_url) ? card.avatar_url : null}
          />

          <div className="mt-6 space-y-3 sm:mt-8">
            {card.phone && (
              <InfoButton href={`tel:${card.phone}`} icon={Phone} label={card.phone} />
            )}

            {card.email && (
              <InfoButton href={`mailto:${card.email}`} icon={Mail} label={card.email} />
            )}

            {isSafeUrl(card.website) && (
              <InfoButton href={card.website} icon={Globe} label="Website" external />
            )}

            {SOCIAL_LINKS.map(({ key, label }) => {
              const url = card[key];

              return isSafeUrl(url) ? (
                <SocialButton key={key} href={url} label={label} />
              ) : null;
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
