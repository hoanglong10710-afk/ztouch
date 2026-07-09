"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export type CreateCardResult = { success: true } | { success: false; error: string };

export async function createCard(): Promise<CreateCardResult> {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Bạn cần đăng nhập để tạo hồ sơ" };
  }

  const publicId = Math.random().toString(36).substring(2, 8).toUpperCase();

  const { error } = await supabase.from("cards").insert({
    owner_id: user.id,
    profile_type: "personal",
    title: "Hồ sơ mới",
    public_id: publicId,
    avatar_url: user.user_metadata.avatar_url,
    status: "active",
    is_public: true,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
