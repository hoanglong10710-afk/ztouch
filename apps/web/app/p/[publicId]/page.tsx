import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { after } from "next/server";
import { Phone, Mail, Globe, MapPin, Siren, Download, HeartPulse } from "lucide-react";
import type { Metadata } from "next";
import ProfileHeader from "@/components/public/ProfileHeader";
import InfoButton from "@/components/public/InfoButton";
import SocialButton from "@/components/public/SocialButton";
import { getCardByPublicId, getPrimaryEmergencyContact, getRescueMedicalInfo } from "./data";
import { createServerSupabase } from "@/lib/supabase/server";
import { recordCardView } from "@/lib/analytics/record-card-view";
import { buildPublicProfileMetadata, notFoundProfileMetadata } from "@/lib/public-profile-metadata";
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
    return notFoundProfileMetadata();
  }

  return buildPublicProfileMetadata(card, publicId);
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

  const { contact } =
    card.profile_type === "rescue"
      ? await getPrimaryEmergencyContact(publicId)
      : { contact: null };

  const { info: medicalInfo } =
    card.profile_type === "rescue" ? await getRescueMedicalInfo(publicId) : { info: null };

  const medicalFields = medicalInfo
    ? [
        { label: "Nhóm máu", value: medicalInfo.blood_type },
        { label: "Dị ứng", value: medicalInfo.allergies },
        { label: "Tình trạng bệnh lý", value: medicalInfo.medical_conditions },
        { label: "Thuốc đang sử dụng", value: medicalInfo.medications },
      ].filter((field) => field.value)
    : [];

  const displayName = card.display_name || card.title || "";
  const socialLinks = SOCIAL_LINKS.filter(({ key }) => isSafeUrl(card[key]));

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
        <article
          aria-label="Hồ sơ công khai"
          className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8"
        >
          <ProfileHeader
            name={displayName}
            jobTitle={card.job_title}
            company={card.company}
            bio={card.bio}
            avatarUrl={isSafeUrl(card.avatar_url) ? card.avatar_url : null}
          />

          {card.profile_type === "rescue" && medicalFields.length > 0 && (
            <section
              aria-labelledby="medical-info-heading"
              className="mt-6 space-y-3 rounded-xl border border-border bg-muted/50 p-4 sm:mt-8 sm:p-5"
            >
              <h2
                id="medical-info-heading"
                className="flex items-center justify-center gap-1.5 text-sm font-semibold tracking-wide text-foreground uppercase"
              >
                <HeartPulse className="size-4" aria-hidden="true" />
                Thông tin y tế
              </h2>

              <dl className="space-y-2">
                {medicalFields.map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <dt className="text-sm text-muted-foreground">{label}</dt>
                    <dd className="font-medium whitespace-pre-wrap text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {card.profile_type === "rescue" && contact && (
            <section
              aria-labelledby="emergency-contact-heading"
              className="mt-6 space-y-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:mt-8 sm:p-5"
            >
              <h2
                id="emergency-contact-heading"
                className="flex items-center justify-center gap-1.5 text-sm font-semibold tracking-wide text-destructive uppercase"
              >
                <Siren className="size-4" aria-hidden="true" />
                Liên hệ khẩn cấp
              </h2>

              <div className="text-center">
                <p className="font-medium text-foreground">{contact.full_name}</p>
                {contact.relationship && (
                  <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                )}
              </div>

              <InfoButton
                href={`tel:${contact.phone}`}
                icon={Phone}
                label="Gọi ngay"
                variant="emergency"
                ariaLabel={`Gọi ngay cho ${contact.full_name}`}
              />
            </section>
          )}

          <section aria-labelledby="contact-info-heading" className="mt-6 space-y-3 sm:mt-8">
            <h2 id="contact-info-heading" className="sr-only">
              Thông tin liên hệ
            </h2>

            {card.phone && (
              <InfoButton
                href={`tel:${card.phone}`}
                icon={Phone}
                label={card.phone}
                ariaLabel={`Gọi điện thoại: ${card.phone}`}
                copyValue={card.phone}
                copyLabel="Sao chép số điện thoại"
              />
            )}

            {card.email && (
              <InfoButton
                href={`mailto:${card.email}`}
                icon={Mail}
                label={card.email}
                ariaLabel={`Gửi email: ${card.email}`}
                copyValue={card.email}
                copyLabel="Sao chép email"
              />
            )}

            {isSafeUrl(card.website) && (
              <InfoButton
                href={card.website}
                icon={Globe}
                label="Website"
                external
                ariaLabel={`Mở website: ${card.website}`}
                copyValue={card.website}
                copyLabel="Sao chép đường dẫn website"
              />
            )}

            {card.address && (
              <InfoButton
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.address)}`}
                icon={MapPin}
                label={card.address}
                external
                ariaLabel={`Xem địa chỉ trên bản đồ: ${card.address}`}
                copyValue={card.address}
                copyLabel="Sao chép địa chỉ"
              />
            )}

            <InfoButton
              href={`/p/${publicId}/vcard`}
              icon={Download}
              label="Lưu danh bạ"
              ariaLabel={`Lưu danh bạ của ${displayName} về máy dưới dạng file .vcf`}
              download
            />
          </section>

          {socialLinks.length > 0 && (
            <section aria-labelledby="social-links-heading" className="mt-6 sm:mt-8">
              <h2 id="social-links-heading" className="sr-only">
                Liên kết mạng xã hội
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map(({ key, label }) => (
                  <SocialButton key={key} href={card[key] as string} label={label} />
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </main>
  );
}
