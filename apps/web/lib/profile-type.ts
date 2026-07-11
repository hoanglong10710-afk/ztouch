import type { ProfileType } from "@/types/card";

export const PROFILE_TYPES: readonly ProfileType[] = ["personal", "rescue"];

export const PROFILE_TYPE_LABELS: Record<ProfileType, string> = {
  personal: "👤 Cá nhân",
  rescue: "🩺 Cứu hộ",
};
