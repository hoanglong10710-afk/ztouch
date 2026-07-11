// Client-only, best-effort session hint used to recognize "the profile the
// user just created" across the create -> edit navigation, so future
// onboarding UI (banner, first-save dialog, QR/NFC intro) can key off it
// without any server-side state. Never throws -- a storage failure (e.g.
// private browsing) just means onboarding hints are skipped, nothing else
// depends on this.

const STORAGE_KEY = "ztouch:first-profile";

export type FirstProfileState = {
  cardId: string;
  publicId: string;
};

export function markFirstProfile(state: FirstProfileState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage unavailable -- nothing else to do.
  }
}

export function readFirstProfile(): FirstProfileState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (typeof parsed?.cardId === "string" && typeof parsed?.publicId === "string") {
      return parsed;
    }

    return null;
  } catch {
    return null;
  }
}
