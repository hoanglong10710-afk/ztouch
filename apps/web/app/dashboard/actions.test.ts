import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabase: vi.fn(),
}));

import { createServerSupabase } from "@/lib/supabase/server";
import { createCard } from "./actions";

const mockedCreateServerSupabase = vi.mocked(createServerSupabase);

type MockUser = { id: string; user_metadata?: Record<string, unknown> } | null;

function makeSupabaseMock({
  user = null as MockUser,
  insertError = null as { message: string } | null,
  insertedId = "card-1",
} = {}) {
  const single = vi.fn().mockResolvedValue(
    insertError ? { data: null, error: insertError } : { data: { id: insertedId }, error: null }
  );
  const select = vi.fn().mockReturnValue({ single });
  const insert = vi.fn().mockReturnValue({ select });
  const from = vi.fn().mockReturnValue({ insert });

  return {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) },
    from,
    __insert: insert,
  };
}

describe("createCard", () => {
  beforeEach(() => {
    mockedCreateServerSupabase.mockReset();
  });

  it("returns a typed error when there is no authenticated user", async () => {
    const supabaseMock = makeSupabaseMock({ user: null });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const result = await createCard();

    expect(result).toEqual({
      success: false,
      error: "Bạn cần đăng nhập để tạo hồ sơ",
    });
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("returns a typed error when the insert fails", async () => {
    const supabaseMock = makeSupabaseMock({
      user: { id: "user-1", user_metadata: {} },
      insertError: { message: "boom" },
    });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const result = await createCard();

    expect(result).toEqual({ success: false, error: "boom" });
  });

  it("returns success with the new card's id and public_id", async () => {
    const supabaseMock = makeSupabaseMock({
      user: { id: "user-1", user_metadata: { avatar_url: "https://example.com/a.png" } },
      insertedId: "card-42",
    });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const result = await createCard();

    expect(result.success).toBe(true);
    if (!result.success) throw new Error("expected success");

    expect(result.cardId).toBe("card-42");
    expect(typeof result.publicId).toBe("string");
    expect(result.publicId.length).toBeGreaterThan(0);
    expect(supabaseMock.from).toHaveBeenCalledWith("cards");

    const insertedRow = supabaseMock.__insert.mock.calls[0][0];
    expect(insertedRow.owner_id).toBe("user-1");
    expect(insertedRow.status).toBe("active");
    expect(insertedRow.is_public).toBe(true);
    expect(insertedRow.avatar_url).toBe("https://example.com/a.png");
    expect(insertedRow.public_id).toBe(result.publicId);
  });
});
