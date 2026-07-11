// Client-only, best-effort session hint marking the profile the user just
// finished setting up (closed the "Profile Ready" dialog for), so the
// dashboard can highlight that card exactly once after returning to it.
// Separate from lib/onboarding/first-profile.ts, which tracks a different
// concern (the create -> edit first-run signal). Never throws.

const STORAGE_KEY = "ztouch:last-completed-profile";

export type LastCompletedProfileState = {
  cardId: string;
};

export function markLastCompletedProfile(state: LastCompletedProfileState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage unavailable -- nothing else to do.
  }
}

export function readLastCompletedProfile(): LastCompletedProfileState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (typeof parsed?.cardId === "string") {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}

export function clearLastCompletedProfile(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // sessionStorage unavailable -- nothing else to do.
  }
}
