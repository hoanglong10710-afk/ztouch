import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabase: vi.fn(),
}));

import { createServerSupabase } from "@/lib/supabase/server";
import { updateCard } from "./actions";
import type { Card } from "@/types/card";

const mockedCreateServerSupabase = vi.mocked(createServerSupabase);

type MockUser = { id: string } | null;

function makeSupabaseMock({
  user = null as MockUser,
  updateError = null as { message: string } | null,
  publicIdMatches = [] as { id: string }[],
  lookupError = null as { message: string } | null,
} = {}) {
  const eqOwner = vi.fn().mockResolvedValue({ error: updateError });
  const eqId = vi.fn().mockReturnValue({ eq: eqOwner });
  const update = vi.fn().mockReturnValue({ eq: eqId });

  const selectEq = vi.fn().mockResolvedValue({ data: publicIdMatches, error: lookupError });
  const select = vi.fn().mockReturnValue({ eq: selectEq });

  const from = vi.fn().mockReturnValue({ update, select });

  return {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) },
    from,
    __update: update,
    __eqId: eqId,
    __eqOwner: eqOwner,
    __select: select,
    __selectEq: selectEq,
  };
}

function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    id: "card-1",
    owner_id: "owner-1",
    public_id: "ABC123",
    profile_type: "personal",
    status: "active",
    is_public: true,
    title: "Hồ sơ mới",
    display_name: null,
    job_title: null,
    company: null,
    bio: null,
    avatar_url: null,
    phone: null,
    email: null,
    website: null,
    facebook: null,
    tiktok: null,
    youtube: null,
    instagram: null,
    linkedin: null,
    github: null,
    address: null,
    created_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("updateCard", () => {
  beforeEach(() => {
    mockedCreateServerSupabase.mockReset();
  });

  it("returns a typed error when there is no authenticated user", async () => {
    const supabaseMock = makeSupabaseMock({ user: null });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const result = await updateCard("card-1", makeCard(), "ABC123");

    expect(result).toEqual({
      success: false,
      error: "Bạn cần đăng nhập để lưu hồ sơ",
    });
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("returns field errors and skips the write when validation fails", async () => {
    const supabaseMock = makeSupabaseMock({ user: { id: "user-1" } });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const result = await updateCard("card-1", makeCard({ title: "" }), "ABC123");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Vui lòng kiểm tra lại thông tin");
      expect(result.fieldErrors?.title).toBeDefined();
    }
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("returns a typed error when the update fails", async () => {
    const supabaseMock = makeSupabaseMock({
      user: { id: "user-1" },
      updateError: { message: "boom" },
    });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const result = await updateCard("card-1", makeCard(), "ABC123");

    expect(result).toEqual({ success: false, error: "boom" });
  });

  it("returns success and scopes the update to the server-derived user id", async () => {
    const supabaseMock = makeSupabaseMock({ user: { id: "user-1" } });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const input = makeCard({ title: "Cập nhật", is_public: false });
    const result = await updateCard("card-1", input, "ABC123");

    expect(result).toEqual({ success: true });
    expect(supabaseMock.from).toHaveBeenCalledWith("cards");
    expect(supabaseMock.__eqId).toHaveBeenCalledWith("id", "card-1");
    expect(supabaseMock.__eqOwner).toHaveBeenCalledWith("owner_id", "user-1");

    const updatedFields = supabaseMock.__update.mock.calls[0][0];
    expect(updatedFields.title).toBe("Cập nhật");
    expect(updatedFields.is_public).toBe(false);
  });

  it("allows an unchanged legacy public_id that would fail the new slug rules", async () => {
    const supabaseMock = makeSupabaseMock({ user: { id: "user-1" } });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const input = makeCard({ public_id: "ABC123" });
    const result = await updateCard("card-1", input, "ABC123");

    expect(result).toEqual({ success: true });
    const updatedFields = supabaseMock.__update.mock.calls[0][0];
    expect(updatedFields.public_id).toBe("ABC123");
  });

  it("accepts a new public_id that matches the slug rules and is available", async () => {
    const supabaseMock = makeSupabaseMock({ user: { id: "user-1" }, publicIdMatches: [] });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const input = makeCard({ public_id: "long" });
    const result = await updateCard("card-1", input, "ABC123");

    expect(result).toEqual({ success: true });
    expect(supabaseMock.__selectEq).toHaveBeenCalledWith("public_id", "long");
    const updatedFields = supabaseMock.__update.mock.calls[0][0];
    expect(updatedFields.public_id).toBe("long");
  });

  it("rejects a changed public_id already used by another card", async () => {
    const supabaseMock = makeSupabaseMock({
      user: { id: "user-1" },
      publicIdMatches: [{ id: "card-2" }],
    });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const input = makeCard({ public_id: "long" });
    const result = await updateCard("card-1", input, "ABC123");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.public_id).toBe("Đường dẫn này đã được sử dụng.");
    }
    expect(supabaseMock.__update).not.toHaveBeenCalled();
  });

  it("allows saving when the only row with that public_id is the card's own row", async () => {
    const supabaseMock = makeSupabaseMock({
      user: { id: "user-1" },
      publicIdMatches: [{ id: "card-1" }],
    });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const input = makeCard({ public_id: "long" });
    const result = await updateCard("card-1", input, "ABC123");

    expect(result).toEqual({ success: true });
    const updatedFields = supabaseMock.__update.mock.calls[0][0];
    expect(updatedFields.public_id).toBe("long");
  });

  it("skips the uniqueness lookup when the public_id is unchanged", async () => {
    const supabaseMock = makeSupabaseMock({ user: { id: "user-1" } });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const input = makeCard({ public_id: "ABC123" });
    const result = await updateCard("card-1", input, "ABC123");

    expect(result).toEqual({ success: true });
    expect(supabaseMock.__select).not.toHaveBeenCalled();
  });

  it("returns a typed error when the uniqueness lookup fails", async () => {
    const supabaseMock = makeSupabaseMock({
      user: { id: "user-1" },
      lookupError: { message: "lookup boom" },
    });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const input = makeCard({ public_id: "long" });
    const result = await updateCard("card-1", input, "ABC123");

    expect(result).toEqual({ success: false, error: "lookup boom" });
    expect(supabaseMock.__update).not.toHaveBeenCalled();
  });

  it("rejects a changed public_id that fails the slug rules", async () => {
    const supabaseMock = makeSupabaseMock({ user: { id: "user-1" } });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const input = makeCard({ public_id: "Not Valid" });
    const result = await updateCard("card-1", input, "ABC123");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.public_id).toBeDefined();
    }
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("rejects a changed public_id that is a reserved word", async () => {
    const supabaseMock = makeSupabaseMock({ user: { id: "user-1" } });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const input = makeCard({ public_id: "admin" });
    const result = await updateCard("card-1", input, "ABC123");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.public_id).toBeDefined();
    }
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("includes profile_type in the update payload", async () => {
    const supabaseMock = makeSupabaseMock({ user: { id: "user-1" } });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    await updateCard("card-1", makeCard({ profile_type: "rescue" }), "ABC123");

    const updatedFields = supabaseMock.__update.mock.calls[0][0];
    expect(updatedFields.profile_type).toBe("rescue");
  });

  it("persists switching from personal to rescue", async () => {
    const supabaseMock = makeSupabaseMock({ user: { id: "user-1" } });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const input = makeCard({ profile_type: "personal" });
    input.profile_type = "rescue";

    const result = await updateCard("card-1", input, "ABC123");

    expect(result).toEqual({ success: true });
    const updatedFields = supabaseMock.__update.mock.calls[0][0];
    expect(updatedFields.profile_type).toBe("rescue");
  });

  it("persists switching from rescue back to personal", async () => {
    const supabaseMock = makeSupabaseMock({ user: { id: "user-1" } });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const input = makeCard({ profile_type: "rescue" });
    input.profile_type = "personal";

    const result = await updateCard("card-1", input, "ABC123");

    expect(result).toEqual({ success: true });
    const updatedFields = supabaseMock.__update.mock.calls[0][0];
    expect(updatedFields.profile_type).toBe("personal");
  });
});
