import { MOCK_SERVER_URL } from "./config";
import { FAKE_USER_ID } from "./auth";

type SeedCardInput = {
  id?: string;
  owner_id?: string;
  public_id?: string;
  title?: string;
  status?: string;
  is_public?: boolean;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  profile_type?: string;
  job_title?: string | null;
  company?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
};

type SeedEmergencyContactInput = {
  id?: string;
  card_id: string;
  full_name?: string;
  relationship?: string | null;
  phone?: string;
  priority?: number;
  is_primary?: boolean;
};

type SeedRescueProfileInput = {
  card_id: string;
  blood_type?: string | null;
  allergies?: string | null;
  medical_conditions?: string | null;
  medications?: string | null;
};

// Talks directly to the mock server's test-only admin endpoints (never the
// real Supabase project) so each test can start from a known, isolated state
// without going through the UI for setup.
export async function resetMockData(): Promise<void> {
  await fetch(`${MOCK_SERVER_URL}/__e2e__/reset`, { method: "POST" });
}

export async function seedCard(input: SeedCardInput = {}): Promise<{ id: string; public_id: string }> {
  const response = await fetch(`${MOCK_SERVER_URL}/__e2e__/seed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ owner_id: FAKE_USER_ID, ...input }),
  });

  return response.json();
}

export async function seedEmergencyContact(
  input: SeedEmergencyContactInput
): Promise<{ id: string }> {
  const response = await fetch(`${MOCK_SERVER_URL}/__e2e__/seed-emergency-contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return response.json();
}

export async function seedRescueProfile(input: SeedRescueProfileInput): Promise<{ card_id: string }> {
  const response = await fetch(`${MOCK_SERVER_URL}/__e2e__/seed-rescue-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return response.json();
}
