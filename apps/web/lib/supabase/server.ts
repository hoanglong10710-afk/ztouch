import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cookie-aware server client: reads the session written by middleware.ts.
// Must be created fresh per request (never shared/cached across requests).
export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component that can't set cookies — safe to
            // ignore here since middleware.ts is responsible for refreshing
            // the session cookie on protected routes.
          }
        },
      },
    }
  );
}
