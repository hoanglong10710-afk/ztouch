-- Phase 9B: Analytics Database Foundation
--
-- Adds append-only public-profile view tracking (card_views) and a control
-- table for a future incremental aggregation job (analytics_aggregation_state).
--
-- Scope of this migration: schema and RLS only.
-- Explicitly NOT included here (deferred to later phases):
--   - any application code that writes to card_views (no after() call site yet)
--   - the aggregation job itself (SQL function + pg_cron schedule)
--   - cards.view_count / cards.last_viewed_at columns (only meaningful once
--     the aggregation job that maintains them exists; adding them now would
--     leave two permanently-zero/NULL columns on `cards` with nothing to
--     populate them)
--   - any dashboard/read-side queries or UI

-- ============================================================
-- Enum types
-- ============================================================

create type card_view_source as enum ('nfc', 'qr', 'link', 'unknown');

create type card_view_referrer_category as enum ('google', 'facebook', 'instagram', 'zalo', 'direct', 'other');

create type card_view_device as enum ('mobile', 'desktop', 'tablet');

-- ============================================================
-- card_views: append-only raw view events
-- ============================================================

create table card_views (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references cards (id) on delete cascade,
  viewed_at timestamptz not null default now(),
  source card_view_source not null default 'unknown',
  referrer_category card_view_referrer_category not null default 'direct',
  device_type card_view_device,
  country char(2),
  seq bigint generated always as identity
);

comment on table card_views is
  'Append-only log of public profile view events. No UPDATE or DELETE is ever performed against this table -- see RLS policies below.';
comment on column card_views.source is
  'How the visitor reached the profile: nfc tag, qr code, a shared/direct link, or unknown if the arrival channel could not be determined.';
comment on column card_views.referrer_category is
  'Normalized category of the HTTP Referer header. Never stores the raw referrer URL.';
comment on column card_views.device_type is
  'Coarse device classification only (mobile/desktop/tablet). Browser and OS parsing are deferred to a later phase.';
comment on column card_views.country is
  'ISO 3166-1 alpha-2 country code, only when trivially available from an existing request header. No IP address is ever stored.';
comment on column card_views.seq is
  'Monotonic cursor for the future incremental aggregation job to track which rows have already been processed. Not a display value and not otherwise meaningful.';

-- Primary read pattern once a dashboard exists: recent views for a given
-- card, newest first.
create index idx_card_views_card_id_viewed_at on card_views (card_id, viewed_at desc);

-- Required by the future aggregation job's "seq > last_processed_seq" scan.
create index idx_card_views_seq on card_views (seq);

-- ============================================================
-- analytics_aggregation_state: single-row watermark for the future
-- aggregation job. No application role has any access to this table --
-- see the RLS section below.
-- ============================================================

create table analytics_aggregation_state (
  id smallint primary key default 1,
  last_processed_seq bigint not null default 0,
  constraint analytics_aggregation_state_single_row check (id = 1)
);

comment on table analytics_aggregation_state is
  'Single-row control table tracking the watermark for the future card_views incremental aggregation job. Not accessible to anon/authenticated roles; only a privileged connection running the aggregation job may read or write it.';

insert into analytics_aggregation_state (id, last_processed_seq) values (1, 0);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table card_views enable row level security;
alter table analytics_aggregation_state enable row level security;

-- Table-level grants. RLS policies only take effect once the underlying SQL
-- privilege already permits the operation, so these are deliberately narrow:
-- no UPDATE/DELETE grant at all for card_views (belt-and-suspenders with the
-- absence of any UPDATE/DELETE policy below), and no grant at all for
-- analytics_aggregation_state.
grant select, insert on card_views to anon, authenticated;
revoke all on analytics_aggregation_state from anon, authenticated, public;

-- INSERT: anonymous and signed-in visitors may record a view, but only for a
-- card that is genuinely public and active -- the same visibility rule
-- already enforced at the application layer for reads (see
-- app/p/[publicId]/data.ts). This constrains WHAT can be inserted (the
-- target card must be one that is actually publicly viewable); it cannot by
-- itself prove the request originated from this app's own recording flow,
-- since there is no service-role key in this project's architecture -- see
-- the migration summary for that caveat.
create policy card_views_insert_for_visible_cards
  on card_views
  for insert
  to anon, authenticated
  with check (
    exists (
      select 1
      from cards
      where cards.id = card_views.card_id
        and cards.is_public = true
        and cards.status = 'active'
    )
  );

-- SELECT: only the owner of the referenced card may read its analytics.
-- Anonymous visitors have no SELECT policy at all, so they are denied by
-- default; signed-in users who don't own the card are excluded by the
-- owner_id check.
create policy card_views_select_owner_only
  on card_views
  for select
  to authenticated
  using (
    exists (
      select 1
      from cards
      where cards.id = card_views.card_id
        and cards.owner_id = auth.uid()
    )
  );

-- No UPDATE or DELETE policy is defined for card_views. With RLS enabled and
-- no permissive policy for a given command, that command is denied by
-- default for every role -- this is what keeps the table append-only at the
-- database level, not merely by application convention.

-- analytics_aggregation_state has RLS enabled with zero policies and no
-- grants to anon/authenticated: it is completely inaccessible via the API.
-- Only a privileged connection (e.g. the future aggregation job) can read or
-- write it.
