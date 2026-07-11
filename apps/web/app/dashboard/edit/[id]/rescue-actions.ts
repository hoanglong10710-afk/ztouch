"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export type SaveRescueDataResult = { success: true } | { success: false; error: string };

export type RescueProfileInput = {
  bloodType: string;
  allergies: string;
  medicalConditions: string;
  medications: string;
};

export type EmergencyContactInput = {
  fullName: string;
  relationship: string;
  phone: string;
};

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

// Phase 10C-3 supports exactly one (the primary) emergency contact per card.
// The database already allows many -- this action only ever reads/writes the
// row with is_primary = true, matching the current UI's single-contact form.
export async function upsertPrimaryEmergencyContact(
  cardId: string,
  input: EmergencyContactInput
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

  if (!input.fullName.trim() || !input.phone.trim()) {
    return { success: false, error: "Vui lòng nhập tên và số điện thoại liên hệ khẩn cấp" };
  }

  const { data: existing, error: selectError } = await supabase
    .from("emergency_contacts")
    .select("id")
    .eq("card_id", cardId)
    .eq("is_primary", true)
    .maybeSingle();

  if (selectError) {
    return { success: false, error: selectError.message };
  }

  const fields = {
    full_name: input.fullName.trim(),
    relationship: nullIfEmpty(input.relationship),
    phone: input.phone.trim(),
  };

  if (existing) {
    const { error } = await supabase
      .from("emergency_contacts")
      .update(fields)
      .eq("id", existing.id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  const { error } = await supabase.from("emergency_contacts").insert({
    card_id: cardId,
    ...fields,
    is_primary: true,
    priority: 0,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
