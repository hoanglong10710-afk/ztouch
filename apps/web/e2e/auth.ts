import type { BrowserContext } from "@playwright/test";
import { MOCK_SERVER_URL } from "./config";

// Mirrors the fake user/session baked into e2e/mock-server.mjs. Keep the two
// in sync if either changes.
export const FAKE_ACCESS_TOKEN = "e2e-fake-access-token";
export const FAKE_USER_ID = "00000000-0000-4000-8000-000000000001";

function buildSessionCookieValue(): string {
  const now = Math.floor(Date.now() / 1000);

  const session = {
    access_token: FAKE_ACCESS_TOKEN,
    refresh_token: "e2e-fake-refresh-token",
    expires_in: 3600,
    expires_at: now + 3600,
    token_type: "bearer",
    user: {
      id: FAKE_USER_ID,
      aud: "authenticated",
      role: "authenticated",
      email: "e2e@example.com",
      phone: "",
      app_metadata: { provider: "google", providers: ["google"] },
      user_metadata: {
        avatar_url: "https://placehold.co/200x200",
        full_name: "E2E Test User",
        email: "e2e@example.com",
        email_verified: true,
      },
      identities: [],
      is_anonymous: false,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
      confirmed_at: "2026-01-01T00:00:00.000Z",
      email_confirmed_at: "2026-01-01T00:00:00.000Z",
      last_sign_in_at: "2026-01-01T00:00:00.000Z",
    },
  };

  // @supabase/ssr stores cookie values as `base64-` + base64url(JSON string)
  // by default (cookieEncoding: "base64url"). Node's base64url encoding
  // already omits padding, matching that implementation.
  const encoded = Buffer.from(JSON.stringify(session), "utf-8").toString("base64url");
  return `base64-${encoded}`;
}

// supabase-js derives the storage/cookie key as `sb-<first-hostname-label>-auth-token`
// from the Supabase URL the client was created with (see SupabaseClient's
// `defaultStorageKey`). Both lib/supabase/client.ts and lib/supabase/server.ts
// read the same NEXT_PUBLIC_SUPABASE_URL, so this must match that host.
function authCookieName(): string {
  const hostname = new URL(MOCK_SERVER_URL).hostname;
  const firstLabel = hostname.split(".")[0];
  return `sb-${firstLabel}-auth-token`;
}

// Signs the browser context in as the fixed E2E test user by seeding the same
// cookie the Supabase JS SDK would have written after a real sign-in — without
// ever touching Google's OAuth screens.
export async function signIn(context: BrowserContext, appUrl: string): Promise<void> {
  await context.addCookies([
    {
      name: authCookieName(),
      value: buildSessionCookieValue(),
      domain: new URL(appUrl).hostname,
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);
}
