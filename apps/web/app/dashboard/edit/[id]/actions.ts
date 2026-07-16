"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { validateCard, hasErrors, type CardFormErrors } from "@/lib/validation/card";
import { validatePublicId } from "@/lib/validation/public-id";
import type { Card } from "@/types/card";

export type UpdateCardResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: CardFormErrors };

// `previousPublicId` is the value loaded from the DB before editing. Legacy
// cards carry randomly-generated public_ids (e.g. "A1B2C3") that predate the
// vanity-slug rules and must keep working without forcing the owner to pick
// a new slug -- so the slug format is only enforced when the id actually
// changes in this edit.
export async function updateCard(
  cardId: string,
  input: Card,
  previousPublicId: string
): Promise<UpdateCardResult> {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Bạn cần đăng nhập để lưu hồ sơ" };
  }

  const fieldErrors = validateCard(input);
  const trimmedPublicId = input.public_id.trim();

  if (input.public_id !== previousPublicId) {
    const publicIdError = validatePublicId(input.public_id);

    if (publicIdError) {
      fieldErrors.public_id = publicIdError;
    } else {
      // Filtered by public_id only (no neq on id) so the uniqueness check
      // works the same against a PostgREST-compatible backend that may not
      // support every filter operator; "owned by this same card" is instead
      // decided client-side below.
      const { data: matches, error: lookupError } = await supabase
        .from("cards")
        .select("id")
        .eq("public_id", trimmedPublicId);

      if (lookupError) {
        return { success: false, error: lookupError.message };
      }

      const takenByAnotherCard = (matches ?? []).some((row) => row.id !== cardId);
      if (takenByAnotherCard) {
        fieldErrors.public_id = "Đường dẫn này đã được sử dụng.";
      }
    }
  }

  if (hasErrors(fieldErrors)) {
    return { success: false, error: "Vui lòng kiểm tra lại thông tin", fieldErrors };
  }

  const { error } = await supabase
    .from("cards")
    .update({
      profile_type: input.profile_type,
      title: input.title,
      display_name: input.display_name,
      avatar_url: input.avatar_url,
      is_public: input.is_public,
      bio: input.bio,
      job_title: input.job_title,
      company: input.company,
      phone: input.phone,
      email: input.email,
      website: input.website,
      facebook: input.facebook,
      tiktok: input.tiktok,
      youtube: input.youtube,
      instagram: input.instagram,
      linkedin: input.linkedin,
      github: input.github,
      address: input.address,
      public_id: trimmedPublicId,
    })
    .eq("id", cardId)
    .eq("owner_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
