import { createServerSupabase } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Card, CardStringField } from "@/types/card";

type Props = {
  params: Promise<{
    publicId: string;
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

const SOCIAL_LINKS: { key: CardStringField; label: string; className: string }[] = [
  { key: "facebook", label: "Facebook", className: "bg-blue-600" },
  { key: "tiktok", label: "TikTok", className: "bg-black" },
  { key: "youtube", label: "YouTube", className: "bg-red-600" },
  { key: "instagram", label: "Instagram", className: "bg-pink-500" },
  { key: "linkedin", label: "LinkedIn", className: "bg-sky-700" },
  { key: "github", label: "GitHub", className: "bg-gray-700" },
];

export default async function PublicPage({ params }: Props) {
  const { publicId } = await params;

  const supabase = createServerSupabase();

  const { data } = await supabase
    .from("cards")
    .select("*")
    .eq("public_id", publicId);

  const card = data?.[0] as Card | undefined;

  if (!card) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-xl p-8">
        <div className="rounded-2xl bg-white p-8 shadow-lg">

          <div className="flex flex-col items-center">

            <img
              src={
                card.avatar_url ||
                "https://placehold.co/200x200"
              }
              alt="Avatar"
              className="h-36 w-36 rounded-full border object-cover"
            />

            <h1 className="mt-6 text-3xl font-bold">
              {card.display_name || card.title}
            </h1>

            <p className="mt-2 text-gray-500">
              {card.job_title}
            </p>

            <p className="mt-6 whitespace-pre-wrap text-center">
              {card.bio}
            </p>

          </div>

          <div className="mt-8 space-y-3">

            {card.phone && (
              <a
                href={`tel:${card.phone}`}
                className="block rounded-xl bg-green-600 p-4 text-center text-white"
              >
                📞 {card.phone}
              </a>
            )}

            {card.email && (
              <a
                href={`mailto:${card.email}`}
                className="block rounded-xl bg-blue-600 p-4 text-center text-white"
              >
                ✉️ {card.email}
              </a>
            )}

            {isSafeUrl(card.website) && (
              <a
                href={card.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl bg-gray-900 p-4 text-center text-white"
              >
                🌍 Website
              </a>
            )}

            {SOCIAL_LINKS.map(({ key, label, className }) => {
              const url = card[key];

              return isSafeUrl(url) ? (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block rounded-xl ${className} p-4 text-center text-white`}
                >
                  {label}
                </a>
              ) : null;
            })}

          </div>

        </div>
      </div>
    </main>
  );
}