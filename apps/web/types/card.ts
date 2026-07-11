export type ProfileType = "personal" | "rescue";

export interface Card {
  id: string;
  owner_id: string;
  public_id: string;
  profile_type: ProfileType;
  status: string;
  is_public: boolean;
  title: string | null;
  display_name: string | null;
  job_title: string | null;
  company: string | null;
  bio: string | null;
  avatar_url: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  facebook: string | null;
  tiktok: string | null;
  youtube: string | null;
  instagram: string | null;
  linkedin: string | null;
  github: string | null;
  address: string | null;
  created_at: string;
}

/** Keys of Card whose value is a plain string (or null) — safe to read/write as text. */
export type CardStringField = {
  [K in keyof Card]: Card[K] extends string | null ? K : never;
}[keyof Card];
