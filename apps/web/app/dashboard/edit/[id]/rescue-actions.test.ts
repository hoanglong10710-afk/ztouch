import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabase: vi.fn(),
}));

import { createServerSupabase } from "@/lib/supabase/server";
import { saveEmergencyContacts, upsertRescueProfile } from "./rescue-actions";
import type { EmergencyContactFormValues } from "@/lib/validation/rescue";

const mockedCreateServerSupabase = vi.mocked(createServerSupabase);

type MockUser = { id: string } | null;

function makeContact(
  overrides: Partial<EmergencyContactFormValues> = {}
): EmergencyContactFormValues {
  return {
    id: null,
    fullName: "Nguyễn Văn A",
    relationship: "Mẹ",
    phone: "0900000000",
    priority: 0,
    isPrimary: false,
    ...overrides,
  };
}

function makeSupabaseMock({
  user = { id: "user-1" } as MockUser,
  ownsCard = true,
  existingContactIds = [] as string[],
  insertedId = "new-contact-1",
  rescueProfileExists = false,
} = {}) {
  const cardsMaybeSingle = vi
    .fn()
    .mockResolvedValue({ data: ownsCard ? { id: "card-1" } : null, error: null });
  const cardsEqOwner = vi.fn().mockReturnValue({ maybeSingle: cardsMaybeSingle });
  const cardsEqId = vi.fn().mockReturnValue({ eq: cardsEqOwner });
  const cardsSelect = vi.fn().mockReturnValue({ eq: cardsEqId });

  const rescueMaybeSingle = vi
    .fn()
    .mockResolvedValue({ data: rescueProfileExists ? { card_id: "card-1" } : null, error: null });
  const rescueSelectEq = vi.fn().mockReturnValue({ maybeSingle: rescueMaybeSingle });
  const rescueSelect = vi.fn().mockReturnValue({ eq: rescueSelectEq });
  const rescueUpdateEq = vi.fn().mockResolvedValue({ error: null });
  const rescueUpdate = vi.fn().mockReturnValue({ eq: rescueUpdateEq });
  const rescueInsert = vi.fn().mockResolvedValue({ error: null });

  const contactsSelectEq = vi
    .fn()
    .mockResolvedValue({ data: existingContactIds.map((id) => ({ id })), error: null });
  const contactsSelect = vi.fn().mockReturnValue({ eq: contactsSelectEq });

  const updateEqCardId = vi.fn().mockResolvedValue({ error: null });
  const updateEqId = vi.fn().mockReturnValue({ eq: updateEqCardId });
  const contactsUpdate = vi.fn().mockReturnValue({ eq: updateEqId });

  const deleteEq = vi.fn().mockResolvedValue({ error: null });
  const contactsDelete = vi.fn().mockReturnValue({ eq: deleteEq });

  const insertSingle = vi.fn().mockResolvedValue({ data: { id: insertedId }, error: null });
  const insertSelect = vi.fn().mockReturnValue({ single: insertSingle });
  const contactsInsert = vi.fn().mockReturnValue({ select: insertSelect });

  const from = vi.fn((table: string) => {
    if (table === "cards") return { select: cardsSelect };
    if (table === "rescue_profiles") {
      return { select: rescueSelect, update: rescueUpdate, insert: rescueInsert };
    }
    if (table === "emergency_contacts") {
      return {
        select: contactsSelect,
        update: contactsUpdate,
        delete: contactsDelete,
        insert: contactsInsert,
      };
    }
    throw new Error(`unexpected table ${table}`);
  });

  return {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) },
    from,
    __contactsUpdate: contactsUpdate,
    __updateEqId: updateEqId,
    __updateEqCardId: updateEqCardId,
    __contactsInsert: contactsInsert,
  };
}

describe("saveEmergencyContacts", () => {
  beforeEach(() => {
    mockedCreateServerSupabase.mockReset();
  });

  it("returns an error when there is no authenticated user", async () => {
    const supabaseMock = makeSupabaseMock({ user: null });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const result = await saveEmergencyContacts("card-1", [makeContact()]);

    expect(result).toEqual({
      success: false,
      error: "Bạn cần đăng nhập để lưu hồ sơ",
    });
  });

  it("returns an error when the caller doesn't own the card", async () => {
    const supabaseMock = makeSupabaseMock({ ownsCard: false });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const result = await saveEmergencyContacts("card-1", [makeContact()]);

    expect(result).toEqual({ success: false, error: "Không tìm thấy hồ sơ" });
  });

  it("rejects a contact id that doesn't belong to this card instead of updating it (IDOR guard)", async () => {
    const supabaseMock = makeSupabaseMock({ existingContactIds: ["own-contact-1"] });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const foreignContact = makeContact({ id: "someone-elses-contact" });
    const result = await saveEmergencyContacts("card-1", [foreignContact]);

    expect(result.success).toBe(false);
    expect(supabaseMock.__contactsUpdate).not.toHaveBeenCalled();
  });

  it("scopes an update to both the contact id and the owned card_id", async () => {
    const supabaseMock = makeSupabaseMock({ existingContactIds: ["own-contact-1"] });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const ownedContact = makeContact({ id: "own-contact-1" });
    const result = await saveEmergencyContacts("card-1", [ownedContact]);

    expect(result.success).toBe(true);
    expect(supabaseMock.__updateEqId).toHaveBeenCalledWith("id", "own-contact-1");
    expect(supabaseMock.__updateEqCardId).toHaveBeenCalledWith("card_id", "card-1");
  });

  it("scopes the primary-contact update to the owned card_id as well", async () => {
    const supabaseMock = makeSupabaseMock({ existingContactIds: ["own-contact-1"] });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const ownedContact = makeContact({ id: "own-contact-1", isPrimary: true });
    const result = await saveEmergencyContacts("card-1", [ownedContact]);

    expect(result.success).toBe(true);
    // Once for the field update, once for the is_primary flip.
    expect(supabaseMock.__contactsUpdate).toHaveBeenCalledTimes(2);
    expect(supabaseMock.__updateEqCardId).toHaveBeenCalledWith("card_id", "card-1");
  });

  it("inserts a new contact scoped to the owned card_id", async () => {
    const supabaseMock = makeSupabaseMock({ existingContactIds: [] });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const result = await saveEmergencyContacts("card-1", [makeContact({ id: null })]);

    expect(result.success).toBe(true);
    expect(supabaseMock.__contactsInsert).toHaveBeenCalledWith(
      expect.objectContaining({ card_id: "card-1" })
    );
  });
});

describe("upsertRescueProfile", () => {
  beforeEach(() => {
    mockedCreateServerSupabase.mockReset();
  });

  it("returns an error when the caller doesn't own the card", async () => {
    const supabaseMock = makeSupabaseMock({ ownsCard: false });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const result = await upsertRescueProfile("card-1", {
      bloodType: "O+",
      allergies: "",
      medicalConditions: "",
      medications: "",
    });

    expect(result).toEqual({ success: false, error: "Không tìm thấy hồ sơ" });
  });
});
