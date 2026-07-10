import { describe, it, expect, vi } from "vitest";
import { getCardViewStats } from "./get-card-view-stats";
import type { SupabaseClient } from "@supabase/supabase-js";

function makeClient(rpc: (...args: unknown[]) => unknown): SupabaseClient {
  return { rpc } as unknown as SupabaseClient;
}

describe("getCardViewStats", () => {
  it("returns an empty object without calling rpc when given no card ids", async () => {
    const rpc = vi.fn();
    const stats = await getCardViewStats(makeClient(rpc), []);

    expect(stats).toEqual({});
    expect(rpc).not.toHaveBeenCalled();
  });

  it("maps rows keyed by card_id into camelCase stats", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [
        {
          card_id: "card-1",
          total_views: 42,
          views_today: 3,
          views_last_7_days: 10,
          views_last_30_days: 30,
        },
      ],
      error: null,
    });

    const stats = await getCardViewStats(makeClient(rpc), ["card-1"]);

    expect(rpc).toHaveBeenCalledWith("get_card_view_stats", { card_ids: ["card-1"] });
    expect(stats).toEqual({
      "card-1": { totalViews: 42, today: 3, last7Days: 10, last30Days: 30 },
    });
  });

  it("returns an empty object when the rpc call reports an error", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: { message: "boom" } });

    const stats = await getCardViewStats(makeClient(rpc), ["card-1"]);

    expect(stats).toEqual({});
  });

  it("returns an empty object when the rpc call throws", async () => {
    const rpc = vi.fn().mockRejectedValue(new Error("network down"));

    const stats = await getCardViewStats(makeClient(rpc), ["card-1"]);

    expect(stats).toEqual({});
  });
});
