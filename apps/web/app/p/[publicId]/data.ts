import { cache } from "react";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Card } from "@/types/card";

// Wrapped in React's cache() so generateMetadata() and the page component
// share a single Supabase call per request instead of querying twice.
export const getCardByPublicId = cache(async (publicId: string) => {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("public_id", publicId)
    .eq("is_public", true)
    .eq("status", "active")
    .limit(1);

  return { card: data?.[0] as Card | undefined, error };
});

export type PrimaryEmergencyContact = {
  full_name: string;
  relationship: string | null;
  phone: string;
};

// Calls the get_primary_emergency_contact(public_id) SECURITY DEFINER RPC
// (see supabase/migrations/20260712090000_public_primary_emergency_contact_function.sql)
// -- the only sanctioned path for an anonymous visitor to read any
// emergency_contacts data. Returns zero rows for a non-public/inactive card
// or a card with no primary contact, by construction of that function.
export async function getPrimaryEmergencyContact(publicId: string) {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .rpc("get_primary_emergency_contact", { public_id: publicId })
    .maybeSingle();

  return { contact: data as PrimaryEmergencyContact | null, error };
}

export type RescueMedicalInfo = {
  blood_type: string | null;
  allergies: string | null;
  medical_conditions: string | null;
  medications: string | null;
};

// Calls the get_rescue_medical_info(public_id) SECURITY DEFINER RPC (see
// supabase/migrations/20260718090000_public_rescue_medical_info_function.sql)
// -- the only sanctioned path for an anonymous visitor to read any
// rescue_profiles data. Returns null for a non-public/inactive/non-rescue
// card or a card with no rescue_profiles row, by construction of that
// function.
export async function getRescueMedicalInfo(publicId: string) {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .rpc("get_rescue_medical_info", { public_id: publicId })
    .maybeSingle();

  return { info: data as RescueMedicalInfo | null, error };
}

export type PublicCardSummary = {
  publicId: string;
  createdAt: string;
};

// Used by app/sitemap.ts to enumerate every indexable profile URL. Applies
// the same is_public/status filter as getCardByPublicId so a private or
// inactive card can never end up listed in the sitemap.
export async function listPublicCardIds(): Promise<PublicCardSummary[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("cards")
    .select("public_id, created_at")
    .eq("is_public", true)
    .eq("status", "active");

  if (error || !data) return [];

  return data.map((row) => ({
    publicId: row.public_id as string,
    createdAt: row.created_at as string,
  }));
}
