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
