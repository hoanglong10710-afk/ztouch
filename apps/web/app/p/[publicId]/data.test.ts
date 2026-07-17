import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabase: vi.fn(),
}));

import { createServerSupabase } from "@/lib/supabase/server";
import {
  getCardByPublicId,
  getPrimaryEmergencyContact,
  getRescueMedicalInfo,
  listPublicCardIds,
} from "./data";
import type { Card } from "@/types/card";

const mockedCreateServerSupabase = vi.mocked(createServerSupabase);

function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    id: "card-1",
    owner_id: "owner-1",
    public_id: "abc123",
    profile_type: "personal",
    status: "active",
    is_public: true,
    title: "Hồ sơ",
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

function makeSupabaseMock({
  rows = [] as Card[],
  error = null as { message: string } | null,
} = {}) {
  const limit = vi.fn().mockResolvedValue({ data: rows, error });
  const eqStatus = vi.fn().mockReturnValue({ limit });
  const eqIsPublic = vi.fn().mockReturnValue({ eq: eqStatus });
  const eqPublicId = vi.fn().mockReturnValue({ eq: eqIsPublic });
  const select = vi.fn().mockReturnValue({ eq: eqPublicId });
  const from = vi.fn().mockReturnValue({ select });

  return {
    from,
    __select: select,
    __eqPublicId: eqPublicId,
    __eqIsPublic: eqIsPublic,
    __eqStatus: eqStatus,
    __limit: limit,
  };
}

describe("getCardByPublicId", () => {
  beforeEach(() => {
    mockedCreateServerSupabase.mockReset();
  });

  it("resolves a legacy random public_id to its card", async () => {
    const card = makeCard({ public_id: "A1B2C3" });
    const supabaseMock = makeSupabaseMock({ rows: [card] });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const result = await getCardByPublicId("A1B2C3");

    expect(result.error).toBeNull();
    expect(result.card).toEqual(card);
    expect(supabaseMock.__eqPublicId).toHaveBeenCalledWith("public_id", "A1B2C3");
  });

  it("resolves a vanity slug public_id to its card", async () => {
    const card = makeCard({ public_id: "sunpeo" });
    const supabaseMock = makeSupabaseMock({ rows: [card] });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const result = await getCardByPublicId("sunpeo");

    expect(result.error).toBeNull();
    expect(result.card).toEqual(card);
    expect(supabaseMock.__eqPublicId).toHaveBeenCalledWith("public_id", "sunpeo");
  });

  it("only queries for public, active cards", async () => {
    const supabaseMock = makeSupabaseMock({ rows: [] });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    await getCardByPublicId("whatever");

    expect(supabaseMock.__eqIsPublic).toHaveBeenCalledWith("is_public", true);
    expect(supabaseMock.__eqStatus).toHaveBeenCalledWith("status", "active");
    expect(supabaseMock.__limit).toHaveBeenCalledWith(1);
  });

  it("returns an undefined card (not an error) when nothing matches", async () => {
    const supabaseMock = makeSupabaseMock({ rows: [] });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const result = await getCardByPublicId("does-not-exist");

    expect(result.card).toBeUndefined();
    expect(result.error).toBeNull();
  });

  it("propagates a query error without leaking data", async () => {
    const supabaseMock = makeSupabaseMock({ rows: [], error: { message: "boom" } });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const result = await getCardByPublicId("whatever");

    expect(result.card).toBeUndefined();
    expect(result.error).toEqual({ message: "boom" });
  });
});

describe("listPublicCardIds", () => {
  beforeEach(() => {
    mockedCreateServerSupabase.mockReset();
  });

  function makeListMock({
    rows = [] as { public_id: string; created_at: string }[],
    error = null as { message: string } | null,
  } = {}) {
    const eqStatus = vi.fn().mockResolvedValue({ data: rows, error });
    const eqIsPublic = vi.fn().mockReturnValue({ eq: eqStatus });
    const select = vi.fn().mockReturnValue({ eq: eqIsPublic });
    const from = vi.fn().mockReturnValue({ select });

    return { from, __select: select, __eqIsPublic: eqIsPublic, __eqStatus: eqStatus };
  }

  it("only selects public, active cards", async () => {
    const supabaseMock = makeListMock({ rows: [] });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    await listPublicCardIds();

    expect(supabaseMock.__select).toHaveBeenCalledWith("public_id, created_at");
    expect(supabaseMock.__eqIsPublic).toHaveBeenCalledWith("is_public", true);
    expect(supabaseMock.__eqStatus).toHaveBeenCalledWith("status", "active");
  });

  it("maps rows to camelCase public_id/created_at pairs", async () => {
    const supabaseMock = makeListMock({
      rows: [
        { public_id: "sunpeo", created_at: "2026-01-01T00:00:00.000Z" },
        { public_id: "A1B2C3", created_at: "2026-02-01T00:00:00.000Z" },
      ],
    });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const result = await listPublicCardIds();

    expect(result).toEqual([
      { publicId: "sunpeo", createdAt: "2026-01-01T00:00:00.000Z" },
      { publicId: "A1B2C3", createdAt: "2026-02-01T00:00:00.000Z" },
    ]);
  });

  it("returns an empty array (never throws) when the query errors", async () => {
    const supabaseMock = makeListMock({ rows: [], error: { message: "boom" } });
    mockedCreateServerSupabase.mockResolvedValue(supabaseMock as never);

    const result = await listPublicCardIds();

    expect(result).toEqual([]);
  });
});

describe("getPrimaryEmergencyContact", () => {
  beforeEach(() => {
    mockedCreateServerSupabase.mockReset();
  });

  it("calls the SECURITY DEFINER rpc scoped to the given public_id", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: { full_name: "A", relationship: "Mẹ", phone: "0900000000" },
      error: null,
    });
    const rpc = vi.fn().mockReturnValue({ maybeSingle });
    mockedCreateServerSupabase.mockResolvedValue({ rpc } as never);

    const result = await getPrimaryEmergencyContact("sunpeo");

    expect(rpc).toHaveBeenCalledWith("get_primary_emergency_contact", { public_id: "sunpeo" });
    expect(result.contact?.full_name).toBe("A");
  });
});

describe("getRescueMedicalInfo", () => {
  beforeEach(() => {
    mockedCreateServerSupabase.mockReset();
  });

  it("calls the SECURITY DEFINER rpc scoped to the given public_id", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: {
        blood_type: "O+",
        allergies: "Penicillin",
        medical_conditions: "Hen suyễn",
        medications: "Ventolin",
      },
      error: null,
    });
    const rpc = vi.fn().mockReturnValue({ maybeSingle });
    mockedCreateServerSupabase.mockResolvedValue({ rpc } as never);

    const result = await getRescueMedicalInfo("sunpeo");

    expect(rpc).toHaveBeenCalledWith("get_rescue_medical_info", { public_id: "sunpeo" });
    expect(result.info?.blood_type).toBe("O+");
    expect(result.info?.medications).toBe("Ventolin");
  });

  it("returns a null info (not an error) when no rescue_profiles row exists", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const rpc = vi.fn().mockReturnValue({ maybeSingle });
    mockedCreateServerSupabase.mockResolvedValue({ rpc } as never);

    const result = await getRescueMedicalInfo("sunpeo");

    expect(result.info).toBeNull();
    expect(result.error).toBeNull();
  });
});
