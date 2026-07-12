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
    .eq("status", "active");

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
