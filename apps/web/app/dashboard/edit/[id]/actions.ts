"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { validateCard, hasErrors, type CardFormErrors } from "@/lib/validation/card";
import type { Card } from "@/types/card";

export type UpdateCardResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: CardFormErrors };

export async function updateCard(cardId: string, input: Card): Promise<UpdateCardResult> {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Bạn cần đăng nhập để lưu hồ sơ" };
  }

  const fieldErrors = validateCard(input);

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
    })
    .eq("id", cardId)
    .eq("owner_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
