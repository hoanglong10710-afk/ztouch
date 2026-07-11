-- Phase 10C-1: Rescue Profile Database Foundation
--
-- Adds the schema for Rescue Profile emergency data: one scalar medical
-- record per card (rescue_profiles) and zero-or-more emergency contacts per
-- card (emergency_contacts).
--
-- Scope of this migration: schema, indexes, constraints, and RLS only.
-- Explicitly NOT included here (deferred to later phases):
--   - any application code that reads or writes these tables (no EditForm
--     fields, no Server Actions, no Public Page rendering yet)
--   - any public/anonymous visibility of rescue data -- today only the
--     owning user can read or write these rows at all; deciding what (if
--     anything) a public visitor should see is a separate, later decision
--   - a trigger to auto-maintain rescue_profiles.updated_at -- until a
--     Server Action exists that updates this row, there is nothing to keep
--     in sync
--   - any UI enforcement of "at least one emergency contact" -- this
--     migration only enforces "at most one primary contact" at the database
--     level (see the partial unique index below)

-- ============================================================
-- rescue_profiles: one-to-one scalar rescue data per card
-- ============================================================

create table rescue_profiles (
  card_id uuid primary key references cards (id) on delete cascade,
  blood_type text,
  allergies text,
  medical_conditions text,
  medications text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table rescue_profiles is
  'One-to-one scalar emergency/medical record for a card. A row here is only meaningful for cards whose profile_type is ''rescue'', but nothing in this migration enforces that -- it is an application-layer decision, not a database constraint. Not yet read or written by any application code (Phase 10C-1 is schema-only).';
comment on column rescue_profiles.card_id is
  'The card this rescue data belongs to. Primary key and foreign key at once -- enforces a strict 1:1 relationship with cards, and deleting the card deletes this row.';
comment on column rescue_profiles.blood_type is
  'Free-text blood type (e.g. "O+"). Not validated against a fixed enum in this phase.';
comment on column rescue_profiles.allergies is
  'Free-text description of known allergies, for a first responder or bystander to read in an emergency.';
comment on column rescue_profiles.medical_conditions is
  'Free-text description of relevant ongoing medical conditions (e.g. diabetes, epilepsy).';
comment on column rescue_profiles.medications is
  'Free-text list of current medications relevant to emergency care decisions.';
comment on column rescue_profiles.created_at is
  'Row creation timestamp.';
comment on column rescue_profiles.updated_at is
  'Last update timestamp. Not auto-maintained by a trigger in this phase -- whichever future Server Action updates this row is responsible for setting it explicitly.';

-- ============================================================
-- emergency_contacts: one-to-many contacts per card
-- ============================================================

create table emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references cards (id) on delete cascade,
  full_name text not null,
  relationship text,
  phone text not null,
  priority integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table emergency_contacts is
  'Emergency contacts for a rescue-profile card. A card may have zero or more contacts. At most one contact per card may have is_primary = true -- enforced by the emergency_contacts_one_primary_per_card partial unique index below, not by application code. Not yet read or written by any application code (Phase 10C-1 is schema-only).';
comment on column emergency_contacts.id is
  'Primary key for the contact row.';
comment on column emergency_contacts.card_id is
  'The card this contact belongs to. A card may have multiple emergency_contacts rows.';
comment on column emergency_contacts.full_name is
  'The contact''s full name.';
comment on column emergency_contacts.relationship is
  'Free-text relationship to the card owner (e.g. "Mẹ", "Vợ", "Bạn thân"). Optional.';
comment on column emergency_contacts.phone is
  'The contact''s phone number -- the single most actionable field in an emergency.';
comment on column emergency_contacts.priority is
  'Display/call order among a card''s contacts, ascending (0 first). Independent of is_primary.';
comment on column emergency_contacts.is_primary is
  'Marks the one contact to surface first/most prominently. At most one row per card_id may be true -- enforced by the partial unique index below, never assumed to already hold for a card (a card may legitimately have zero primary contacts).';
comment on column emergency_contacts.created_at is
  'Row creation timestamp.';

-- Supports "all contacts for a card" lookups and speeds up the cascade
-- delete from cards -- Postgres does not automatically index FK columns.
create index idx_emergency_contacts_card_id on emergency_contacts (card_id);

-- Supports "all contacts for a card, in display/call order" -- the read
-- pattern the future emergency-contacts UI will actually use.
create index idx_emergency_contacts_card_id_priority on emergency_contacts (card_id, priority);

-- Enforces "no more than one primary contact per card" without requiring
-- "at least one" -- rows with is_primary = false (or null) are simply not
-- covered by this partial index, so any number of those may coexist.
create unique index emergency_contacts_one_primary_per_card
  on emergency_contacts (card_id)
  where is_primary = true;

-- ============================================================
-- Row Level Security
-- ============================================================
--
-- Ownership is not stored directly on either table (there is no owner_id
-- column here) -- both tables reuse the exact "join back to cards.owner_id"
-- pattern already established for card_views in
-- 20260709120000_analytics_foundation.sql, rather than inventing a new
-- authorization model.
--
-- Unlike card_views, there is no anonymous/public policy of any kind here:
-- only the authenticated owner of the parent card may select, insert,
-- update, or delete rows in either table. Table-level grants are scoped to
-- match -- anon and public get nothing.

alter table rescue_profiles enable row level security;
alter table emergency_contacts enable row level security;

grant select, insert, update, delete on rescue_profiles to authenticated;
revoke all on rescue_profiles from anon, public;

grant select, insert, update, delete on emergency_contacts to authenticated;
revoke all on emergency_contacts from anon, public;

create policy rescue_profiles_select_owner_only
  on rescue_profiles
  for select
  to authenticated
  using (
    exists (
      select 1
      from cards
      where cards.id = rescue_profiles.card_id
        and cards.owner_id = auth.uid()
    )
  );

create policy rescue_profiles_insert_owner_only
  on rescue_profiles
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from cards
      where cards.id = rescue_profiles.card_id
        and cards.owner_id = auth.uid()
    )
  );

create policy rescue_profiles_update_owner_only
  on rescue_profiles
  for update
  to authenticated
  using (
    exists (
      select 1
      from cards
      where cards.id = rescue_profiles.card_id
        and cards.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from cards
      where cards.id = rescue_profiles.card_id
        and cards.owner_id = auth.uid()
    )
  );

create policy rescue_profiles_delete_owner_only
  on rescue_profiles
  for delete
  to authenticated
  using (
    exists (
      select 1
      from cards
      where cards.id = rescue_profiles.card_id
        and cards.owner_id = auth.uid()
    )
  );

create policy emergency_contacts_select_owner_only
  on emergency_contacts
  for select
  to authenticated
  using (
    exists (
      select 1
      from cards
      where cards.id = emergency_contacts.card_id
        and cards.owner_id = auth.uid()
    )
  );

create policy emergency_contacts_insert_owner_only
  on emergency_contacts
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from cards
      where cards.id = emergency_contacts.card_id
        and cards.owner_id = auth.uid()
    )
  );

create policy emergency_contacts_update_owner_only
  on emergency_contacts
  for update
  to authenticated
  using (
    exists (
      select 1
      from cards
      where cards.id = emergency_contacts.card_id
        and cards.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from cards
      where cards.id = emergency_contacts.card_id
        and cards.owner_id = auth.uid()
    )
  );

create policy emergency_contacts_delete_owner_only
  on emergency_contacts
  for delete
  to authenticated
  using (
    exists (
      select 1
      from cards
      where cards.id = emergency_contacts.card_id
        and cards.owner_id = auth.uid()
    )
  );
