import type { SupabaseClient } from "@supabase/supabase-js";

export type CardViewStats = {
  totalViews: number;
  today: number;
  last7Days: number;
  last30Days: number;
};

type CardViewStatsRow = {
  card_id: string;
  total_views: number;
  views_today: number;
  views_last_7_days: number;
  views_last_30_days: number;
};

// The only allowed entry point into card view analytics reads. Callers
// (e.g. the dashboard) must go through this function instead of calling
// supabase.rpc() themselves, so the underlying storage/query strategy (a
// live scan today, possibly pre-aggregated data later) can change without
// touching call sites. Never throws -- a stats failure degrades to an
// empty result rather than breaking the dashboard.
export async function getCardViewStats(
  supabase: SupabaseClient,
  cardIds: string[]
): Promise<Record<string, CardViewStats>> {
  if (cardIds.length === 0) return {};

  try {
    const { data, error } = await supabase.rpc("get_card_view_stats", {
      card_ids: cardIds,
    });

    if (error) {
      console.error("[analytics] get_card_view_stats failed", error.message);
      return {};
    }

    const stats: Record<string, CardViewStats> = {};

    for (const row of (data ?? []) as CardViewStatsRow[]) {
      stats[row.card_id] = {
        totalViews: row.total_views,
        today: row.views_today,
        last7Days: row.views_last_7_days,
        last30Days: row.views_last_30_days,
      };
    }

    return stats;
  } catch (err) {
    console.error("[analytics] get_card_view_stats threw", err);
    return {};
  }
}
