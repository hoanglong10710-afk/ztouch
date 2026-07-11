"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { PROFILE_TYPES } from "@/lib/profile-type";
import type { ProfileType } from "@/types/card";

export type CreateCardResult =
  | { success: true; cardId: string; publicId: string }
  | { success: false; error: string };

function isValidProfileType(value: string): value is ProfileType {
  return (PROFILE_TYPES as readonly string[]).includes(value);
}

export async function createCard(profileType: string): Promise<CreateCardResult> {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Bạn cần đăng nhập để tạo hồ sơ" };
  }

  if (!isValidProfileType(profileType)) {
    return { success: false, error: "Loại hồ sơ không hợp lệ" };
  }

  const publicId = Math.random().toString(36).substring(2, 8).toUpperCase();

  const { data, error } = await supabase
    .from("cards")
    .insert({
      owner_id: user.id,
      profile_type: profileType,
      title: "Hồ sơ mới",
      public_id: publicId,
      avatar_url: user.user_metadata.avatar_url,
      status: "active",
      is_public: true,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, cardId: data.id, publicId };
}
