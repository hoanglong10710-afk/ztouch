import type { SupabaseClient } from "@supabase/supabase-js";
import { classifyDevice, classifyReferrer, classifySource } from "./classify";

export type RecordCardViewInput = {
  cardId: string;
  src: string | string[] | undefined;
  referer: string | null;
  userAgent: string | null;
};

// Records one append-only row into card_views. Best-effort only: this must
// never throw and must never be allowed to affect the public profile
// response, which by the time this runs (called from after(), see
// app/p/[publicId]/page.tsx) has already been sent to the visitor. Failures
// are logged and otherwise ignored.
export async function recordCardView(
  supabase: SupabaseClient,
  input: RecordCardViewInput
): Promise<void> {
  try {
    const { error } = await supabase.from("card_views").insert({
      card_id: input.cardId,
      source: classifySource(input.src),
      referrer_category: classifyReferrer(input.referer),
      device_type: classifyDevice(input.userAgent),
    });

    if (error) {
      console.error("[analytics] card_views insert failed", input.cardId, error.message);
    }
  } catch (err) {
    console.error("[analytics] card_views insert threw", input.cardId, err);
  }
}
