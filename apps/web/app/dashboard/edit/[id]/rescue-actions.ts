"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { validateEmergencyContact, hasErrors } from "@/lib/validation/rescue";
import type { EmergencyContactFormValues } from "@/lib/validation/rescue";

export type SaveRescueDataResult = { success: true } | { success: false; error: string };

export type RescueProfileInput = {
  bloodType: string;
  allergies: string;
  medicalConditions: string;
  medications: string;
};

export type SaveEmergencyContactsResult =
  | { success: true; contacts: EmergencyContactFormValues[] }
  | { success: false; error: string };

type ServerSupabase = Awaited<ReturnType<typeof createServerSupabase>>;

async function assertOwnsCard(
  supabase: ServerSupabase,
  cardId: string,
  userId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("cards")
    .select("id")
    .eq("id", cardId)
    .eq("owner_id", userId)
    .maybeSingle();

  if (error) return error.message;
  if (!data) return "Không tìm thấy hồ sơ";
  return null;
}

function nullIfEmpty(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

// Kept isolated from app/dashboard/edit/[id]/actions.ts (the flat `cards`
// update) on purpose -- rescue data lives in its own tables, so it gets its
// own Server Actions rather than being folded into updateCard().
export async function upsertRescueProfile(
  cardId: string,
  input: RescueProfileInput
): Promise<SaveRescueDataResult> {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Bạn cần đăng nhập để lưu hồ sơ" };
  }

  const ownershipError = await assertOwnsCard(supabase, cardId, user.id);
  if (ownershipError) {
    return { success: false, error: ownershipError };
  }

  const { data: existing, error: selectError } = await supabase
    .from("rescue_profiles")
    .select("card_id")
    .eq("card_id", cardId)
    .maybeSingle();

  if (selectError) {
    return { success: false, error: selectError.message };
  }

  const fields = {
    blood_type: nullIfEmpty(input.bloodType),
    allergies: nullIfEmpty(input.allergies),
    medical_conditions: nullIfEmpty(input.medicalConditions),
    medications: nullIfEmpty(input.medications),
  };

  if (existing) {
    const { error } = await supabase
      .from("rescue_profiles")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("card_id", cardId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  const { error } = await supabase.from("rescue_profiles").insert({
    card_id: cardId,
    ...fields,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// Phase 10C-5: full CRUD over a card's emergency contacts, saved as one unit
// in the same flow as upsertRescueProfile. The caller sends the complete
// desired list (existing contacts carry their `id`, new ones have `id:
// null`); this action diffs it against what's in the database and applies
// inserts/updates/deletes, then returns the saved list with server-assigned
// ids so the caller's local state can stay in sync without a refetch.
export async function saveEmergencyContacts(
  cardId: string,
  contacts: EmergencyContactFormValues[]
): Promise<SaveEmergencyContactsResult> {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Bạn cần đăng nhập để lưu hồ sơ" };
  }

  const ownershipError = await assertOwnsCard(supabase, cardId, user.id);
  if (ownershipError) {
    return { success: false, error: ownershipError };
  }

  for (const contact of contacts) {
    if (hasErrors(validateEmergencyContact(contact))) {
      return {
        success: false,
        error: "Vui lòng nhập đầy đủ họ tên và số điện thoại cho mọi liên hệ khẩn cấp",
      };
    }
  }

  const { data: existingRows, error: selectError } = await supabase
    .from("emergency_contacts")
    .select("id")
    .eq("card_id", cardId);

  if (selectError) {
    return { success: false, error: selectError.message };
  }

  const keepIds = new Set(contacts.filter((c) => c.id).map((c) => c.id as string));
  const idsToDelete = (existingRows ?? [])
    .map((row) => row.id as string)
    .filter((id) => !keepIds.has(id));

  for (const id of idsToDelete) {
    const { error } = await supabase.from("emergency_contacts").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
  }

  // Two-phase write: first persist every contact with is_primary forced to
  // false, then flip on the single chosen primary. This is what keeps the
  // emergency_contacts_one_primary_per_card partial unique index from
  // rejecting an intermediate state where the new and old primary would
  // otherwise briefly both be true.
  const saved: EmergencyContactFormValues[] = [];

  for (const contact of contacts) {
    const fields = {
      full_name: contact.fullName.trim(),
      relationship: nullIfEmpty(contact.relationship),
      phone: contact.phone.trim(),
      priority: contact.priority,
      is_primary: false,
    };

    if (contact.id) {
      const { error } = await supabase
        .from("emergency_contacts")
        .update(fields)
        .eq("id", contact.id);

      if (error) return { success: false, error: error.message };
      saved.push({ ...contact, id: contact.id, isPrimary: false });
    } else {
      const { data, error } = await supabase
        .from("emergency_contacts")
        .insert({ card_id: cardId, ...fields })
        .select("id")
        .single();

      if (error) return { success: false, error: error.message };
      saved.push({ ...contact, id: data.id as string, isPrimary: false });
    }
  }

  const primaryIndex = contacts.findIndex((c) => c.isPrimary);

  if (primaryIndex !== -1 && saved[primaryIndex]) {
    const { error } = await supabase
      .from("emergency_contacts")
      .update({ is_primary: true })
      .eq("id", saved[primaryIndex].id as string);

    if (error) return { success: false, error: error.message };
    saved[primaryIndex] = { ...saved[primaryIndex], isPrimary: true };
  }

  return { success: true, contacts: saved };
}
