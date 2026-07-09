import { supabase } from "@/lib/supabase/client";

export const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

export class AvatarUploadError extends Error {}

export async function uploadAvatar(
  ownerId: string,
  cardId: string,
  file: File
): Promise<string> {
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    throw new AvatarUploadError("Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP");
  }

  if (file.size > MAX_AVATAR_SIZE_BYTES) {
    throw new AvatarUploadError("Ảnh vượt quá dung lượng tối đa 5MB");
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${ownerId}/${cardId}.${ext}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) {
    throw new AvatarUploadError(error.message);
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);

  return data.publicUrl;
}
