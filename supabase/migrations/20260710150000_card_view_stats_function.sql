-- Phase 9D-1: Analytics Read Path
--
-- Adds a single RPC that returns per-card view stats (total, today, last 7
-- days, last 30 days) for a set of card ids in one round trip. This is the
-- only thing the dashboard is allowed to call directly (see
-- lib/analytics/get-card-view-stats.ts) -- callers never query card_views
-- themselves, so this function is the one seam that has to change if/when
-- the deferred aggregation job (see 20260709120000_analytics_foundation.sql)
-- starts backing these numbers with pre-aggregated data instead of a live
-- scan.
--
-- Security: SECURITY INVOKER (the default) is used deliberately, not
-- SECURITY DEFINER. The function runs as the calling role, so the existing
-- card_views_select_owner_only RLS policy still applies per row -- passing
-- a card_id the caller doesn't own simply returns no row for it. No new
-- authorization logic is introduced here; ownership is still keyed off
-- cards.owner_id via that policy, exactly as before.
--
-- "Today" is defined as the current calendar day in Asia/Ho_Chi_Minh (not a
-- rolling 24h window), per explicit product decision.

create or replace function get_card_view_stats(card_ids uuid[])
returns table (
  card_id uuid,
  total_views integer,
  views_today integer,
  views_last_7_days integer,
  views_last_30_days integer
)
language sql
security invoker
stable
set search_path = public
as $$
  select
    cv.card_id,
    count(*)::integer as total_views,
    count(*) filter (
      where cv.viewed_at >= (
        date_trunc('day', now() at time zone 'Asia/Ho_Chi_Minh') at time zone 'Asia/Ho_Chi_Minh'
      )
    )::integer as views_today,
    count(*) filter (where cv.viewed_at >= now() - interval '7 days')::integer as views_last_7_days,
    count(*) filter (where cv.viewed_at >= now() - interval '30 days')::integer as views_last_30_days
  from card_views cv
  where cv.card_id = any(card_ids)
  group by cv.card_id;
$$;

comment on function get_card_view_stats(uuid[]) is
  'Returns total/today/7d/30d view counts per card id, scoped by the caller''s own RLS visibility into card_views. "Today" is a calendar day in Asia/Ho_Chi_Minh, not a rolling 24h window.';

-- Postgres grants EXECUTE to PUBLIC by default on new functions. Revoke that
-- and grant explicitly to authenticated only -- anon has no SELECT policy on
-- card_views anyway (so an anon call would just return zero rows), but
-- being explicit here matches this project's existing pattern of
-- deliberate, minimal grants rather than relying on defaults.
revoke execute on function get_card_view_stats(uuid[]) from public;
grant execute on function get_card_view_stats(uuid[]) to authenticated;
