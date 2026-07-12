-- Phase 10C-6: Public Rescue Access (primary emergency contact only)
--
-- Adds a single RPC, get_primary_emergency_contact(public_id), that lets an
-- anonymous visitor of a public rescue profile read just the primary
-- emergency contact's name, relationship, and phone number.
--
-- Security: SECURITY DEFINER is used deliberately here, unlike
-- get_card_view_stats in 20260710150000_card_view_stats_function.sql --
-- anon has (and keeps) zero table-level access to emergency_contacts (see
-- 20260711090000_rescue_profiles_foundation.sql: "revoke all on
-- emergency_contacts from anon, public"). This function is the one narrow,
-- explicit exception to that: it runs with the privileges of its owner, but
-- its body hard-codes every condition that makes a contact safe to expose
-- (the parent card must be public and active, and the contact must be the
-- primary one), and its return type only carries the three columns meant to
-- ever be public. No RLS policy, grant, table, or index from any prior
-- migration is modified by this one.
--
-- search_path is pinned to (public, pg_temp) so this SECURITY DEFINER
-- function can't be tricked into resolving `cards`/`emergency_contacts` (or
-- built-in operators) against a schema an attacker controls.

create or replace function get_primary_emergency_contact(public_id text)
returns table (
  full_name text,
  relationship text,
  phone text
)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select
    ec.full_name,
    ec.relationship,
    ec.phone
  from emergency_contacts ec
  join cards c on c.id = ec.card_id
  where c.public_id = get_primary_emergency_contact.public_id
    and c.is_public = true
    and c.status = 'active'
    and ec.is_primary = true
  limit 1;
$$;

comment on function get_primary_emergency_contact(text) is
  'Returns the primary emergency contact (full_name, relationship, phone) for the public, active rescue card identified by public_id, or zero rows if no such card/contact exists. SECURITY DEFINER: the only sanctioned path for anonymous access to emergency_contacts data -- see comment above.';

-- Postgres grants EXECUTE to PUBLIC by default on new functions. Revoke that
-- and grant explicitly to anon and authenticated, matching this project's
-- existing pattern of deliberate, minimal grants rather than relying on
-- defaults.
revoke execute on function get_primary_emergency_contact(text) from public;
grant execute on function get_primary_emergency_contact(text) to anon, authenticated;
