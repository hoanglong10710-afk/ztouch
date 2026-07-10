-- Phase 9B-2: Export Existing Production RLS
--
-- This migration is a version-controlled, faithful reproduction of RLS
-- policies that were already live and manually verified on the production
-- Supabase project. It does not change, add to, or redesign any policy
-- logic. Every USING/WITH CHECK expression, role, and command below is
-- taken directly from the production database's pg_policy / pg_policies
-- system catalogs and storage.buckets row, captured 2026-07-10. Note that
-- Postgres does not store the original CREATE POLICY statement text
-- anywhere -- only this parsed metadata -- so what follows is the
-- semantically exact, but not byte-for-byte, reconstruction of each policy;
-- that is the most "verbatim" any RLS export can be.
--
-- Scope of this migration:
--   - RLS policies on public.cards
--   - RLS policies on storage.objects for the `avatars` bucket
--   - storage.buckets row for `avatars`
--   Table-level GRANTs are intentionally excluded -- see the note above the
--   storage section for why.
--
-- Explicitly NOT included / out of scope for this phase:
--   - public.cards table DDL (columns, types, constraints, indexes). No
--     migration in this repo creates that table -- it predates the
--     migrations directory and was created directly in Supabase Studio.
--     This migration assumes the table already exists; see the
--     accompanying summary for what that means for fresh-project recreation.
--   - Any change to what the policies allow. If production behavior needs
--     to change, that is a separate, explicit follow-up -- not this phase.

-- ============================================================
-- public.cards: Row Level Security
-- ============================================================

alter table cards enable row level security;

-- SELECT: any client, including unauthenticated visitors, may read a card
-- its owner has marked public. No role restriction in production.
create policy "Public can view public cards"
  on cards
  for select
  to public
  using (is_public = true);

-- SELECT: a signed-in user may always read their own cards, public or not.
create policy "Users can view own cards"
  on cards
  for select
  to authenticated
  using (auth.uid() = owner_id);

-- INSERT: a signed-in user may only create cards they themselves own.
create policy "Users can insert own cards"
  on cards
  for insert
  to authenticated
  with check (auth.uid() = owner_id);

-- UPDATE: a signed-in user may only update their own cards, and the row
-- must still belong to them after the update (same expression on USING and
-- WITH CHECK in production).
create policy "Users can update own cards"
  on cards
  for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- DELETE: a signed-in user may only delete their own cards.
create policy "Users can delete own cards"
  on cards
  for delete
  to authenticated
  using (auth.uid() = owner_id);

-- Note: production also shows anon/authenticated holding the full standard
-- set of table privileges on cards (SELECT, INSERT, UPDATE, DELETE,
-- TRUNCATE, REFERENCES, TRIGGER -- i.e. GRANT ALL). That is Supabase's
-- automatic default whenever a table is created via Studio, not something
-- that was deliberately configured, and it was not requested as part of
-- this export's scope. It is deliberately NOT reproduced as a statement
-- here: a GRANT is a silent overwrite (unlike CREATE POLICY, which errors
-- loudly on a name collision), so replaying it later could quietly
-- re-widen privileges past whatever grants exist on the target database at
-- that time. Access control is enforced by the RLS policies above
-- regardless of these grants.

-- ============================================================
-- storage: avatars bucket configuration
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types, avif_autodetection)
values ('avatars', 'avatars', true, null, null, false)
on conflict (id) do update set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types,
  avif_autodetection = excluded.avif_autodetection;

-- ============================================================
-- storage.objects: Row Level Security for the avatars bucket
-- ============================================================
-- RLS is already enabled on storage.objects by default in every Supabase
-- project. This statement is included only so the migration is
-- self-contained and idempotent-safe when replayed onto a fresh project.
alter table storage.objects enable row level security;

-- SELECT: avatars are public images -- any client, including an
-- unauthenticated visitor viewing a public profile, may read any object in
-- this bucket.
create policy "Avatar Read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'avatars');

-- INSERT: a signed-in user may only upload into their own top-level folder.
-- lib/supabase/storage.ts writes to `${user.id}/${cardId}.${ext}`, so the
-- first path segment must equal the uploader's auth.uid().
create policy "Avatar Upload"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (auth.uid())::text = (storage.foldername(name))[1]
  );

-- UPDATE: a signed-in user may only overwrite objects already inside their
-- own folder (relevant to the { upsert: true } re-upload path).
create policy "Avatar Update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (auth.uid())::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'avatars'
    and (auth.uid())::text = (storage.foldername(name))[1]
  );

-- DELETE: a signed-in user may only delete objects inside their own folder.
create policy "Avatar Delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (auth.uid())::text = (storage.foldername(name))[1]
  );
