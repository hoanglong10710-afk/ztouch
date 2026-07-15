import { getCardByPublicId } from "../data";
import { generateVCard } from "@/lib/vcard";

// Card data can change after an owner edits their profile or toggles
// visibility, so this route must always re-check public/private status
// instead of serving a cached vCard for a card that's since gone private.
export const dynamic = "force-dynamic";

const COMBINING_DIACRITICAL_MARKS = /[̀-ͯ]/g;

// vCard filenames only need to be readable, not lossless -- diacritics are
// stripped and anything left that isn't filesystem-safe is dropped so the
// plain `filename` fallback works on clients that ignore `filename*`.
function toAsciiFilename(value: string): string {
  const ascii = value
    .normalize("NFD")
    .replace(COMBINING_DIACRITICAL_MARKS, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^a-zA-Z0-9 _-]/g, "")
    .trim();

  return ascii || "contact";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  const { publicId } = await params;
  const { card, error } = await getCardByPublicId(publicId);

  if (error || !card) {
    return new Response("Không tìm thấy hồ sơ", { status: 404 });
  }

  const displayName = card.display_name || card.title || "Hồ sơ Z-TOUCH";

  const vcard = generateVCard({
    displayName,
    jobTitle: card.job_title,
    company: card.company,
    phone: card.phone,
    email: card.email,
    website: card.website,
  });

  const asciiFilename = toAsciiFilename(displayName);
  const encodedFilename = encodeURIComponent(`${displayName}.vcf`);

  return new Response(vcard, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition":
        `attachment; filename="${asciiFilename}.vcf"; ` + `filename*=UTF-8''${encodedFilename}`,
    },
  });
}
