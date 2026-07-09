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
} = {}) {
  const eqOwner = vi.fn().mockResolvedValue({ error: updateError });
  const eqId = vi.fn().mockReturnValue({ eq: eqOwner });
  const update = vi.fn().mockReturnValue({ eq: eqId });
  const from = vi.fn().mockReturnValue({ update });

  return {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) },
    from,
    __update: update,
    __eqId: eqId,
    __eqOwner: eqOwner,
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

    const result = await updateCard("card-1", makeCard());

    expect(result).toEqual({
      success: false,
      error: "Bạn cần đăng nhập để lưu hồ sơ",
    });
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("returns field errors and skips the write when validation fails", async () => {
    const supabaseMock = makeSupabaseMock({ user: { id: "user-1" } });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const result = await updateCard("card-1", makeCard({ title: "" }));

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

    const result = await updateCard("card-1", makeCard());

    expect(result).toEqual({ success: false, error: "boom" });
  });

  it("returns success and scopes the update to the server-derived user id", async () => {
    const supabaseMock = makeSupabaseMock({ user: { id: "user-1" } });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const input = makeCard({ title: "Cập nhật", is_public: false });
    const result = await updateCard("card-1", input);

    expect(result).toEqual({ success: true });
    expect(supabaseMock.from).toHaveBeenCalledWith("cards");
    expect(supabaseMock.__eqId).toHaveBeenCalledWith("id", "card-1");
    expect(supabaseMock.__eqOwner).toHaveBeenCalledWith("owner_id", "user-1");

    const updatedFields = supabaseMock.__update.mock.calls[0][0];
    expect(updatedFields.title).toBe("Cập nhật");
    expect(updatedFields.is_public).toBe(false);
  });
});
