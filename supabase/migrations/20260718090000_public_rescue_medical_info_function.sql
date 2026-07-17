-- Phase 10C-7: Public Rescue Access (medical info)
--
-- Adds get_rescue_medical_info(public_id), the rescue_profiles counterpart
-- to get_primary_emergency_contact in
-- 20260712090000_public_primary_emergency_contact_function.sql -- anon has
-- (and keeps) zero table-level access to rescue_profiles (see
-- 20260711090000_rescue_profiles_foundation.sql: "revoke all on
-- rescue_profiles from anon, public"). This function is the one narrow,
-- explicit exception to that: it runs with the privileges of its owner, but
-- its body hard-codes every condition that makes a rescue_profiles row safe
-- to expose (the parent card must be public, active, and profile_type =
-- 'rescue'), and its return type only carries the four scalar columns meant
-- to ever be public.
--
-- search_path is pinned to (public, pg_temp) for the same reason as
-- get_primary_emergency_contact: a SECURITY DEFINER function must not be
-- trickable into resolving `cards`/`rescue_profiles` against a schema an
-- attacker controls.

create or replace function get_rescue_medical_info(public_id text)
returns table (
  blood_type text,
  allergies text,
  medical_conditions text,
  medications text
)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select
    rp.blood_type,
    rp.allergies,
    rp.medical_conditions,
    rp.medications
  from rescue_profiles rp
  join cards c on c.id = rp.card_id
  where c.public_id = get_rescue_medical_info.public_id
    and c.is_public = true
    and c.status = 'active'
    and c.profile_type = 'rescue'
  limit 1;
$$;

comment on function get_rescue_medical_info(text) is
  'Returns the medical fields (blood_type, allergies, medical_conditions, medications) for the public, active rescue card identified by public_id, or zero rows if no such card/rescue_profiles row exists. SECURITY DEFINER: the only sanctioned path for anonymous access to rescue_profiles data -- see comment above.';

revoke execute on function get_rescue_medical_info(text) from public;
grant execute on function get_rescue_medical_info(text) to anon, authenticated;
