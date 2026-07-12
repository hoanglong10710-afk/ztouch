import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// This repo has no local Postgres/Supabase CLI test harness (see
// supabase/ -- there is no config.toml, docker-compose, or CLI setup), so
// there is no way to actually execute this migration in CI. This test is a
// static, text-level check of the migration file itself: it verifies the
// specific security properties phase 10C-6 requires (SECURITY DEFINER,
// pinned search_path, no SELECT *, no dynamic SQL, minimal return columns,
// exact filter conditions, and that no pre-existing object is touched) are
// present in the SQL, so a future edit to this file can't silently drop one
// of them without a red test.
const MIGRATION_PATH = join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "supabase",
  "migrations",
  "20260712090000_public_primary_emergency_contact_function.sql"
);

const sql = readFileSync(MIGRATION_PATH, "utf-8");

// Strips `--` comment lines before checking for statements that must be
// absent, so a comment merely *mentioning* e.g. "revoke all" (to explain why
// this migration doesn't need to) can't produce a false failure.
const sqlStatementsOnly = sql
  .split("\n")
  .filter((line) => !line.trim().startsWith("--"))
  .join("\n");

describe("get_primary_emergency_contact migration", () => {
  it("defines the function as SECURITY DEFINER", () => {
    expect(sql).toMatch(/security definer/i);
  });

  it("pins search_path to public, pg_temp", () => {
    expect(sql).toMatch(/set search_path\s*=\s*public,\s*pg_temp/i);
  });

  it("does not use SELECT *", () => {
    expect(sql).not.toMatch(/select\s+\*/i);
  });

  it("returns only full_name, relationship, and phone", () => {
    expect(sql).toMatch(
      /returns table\s*\(\s*full_name text,\s*relationship text,\s*phone text\s*\)/i
    );
  });

  it("looks up the card by public_id", () => {
    expect(sql).toMatch(/c\.public_id\s*=\s*get_primary_emergency_contact\.public_id/i);
  });

  it("requires the parent card to be public and active", () => {
    expect(sql).toMatch(/c\.is_public\s*=\s*true/i);
    expect(sql).toMatch(/c\.status\s*=\s*'active'/i);
  });

  it("requires the contact to be the primary one", () => {
    expect(sql).toMatch(/ec\.is_primary\s*=\s*true/i);
  });

  it("returns at most one row", () => {
    expect(sql).toMatch(/limit 1/i);
  });

  it("grants execute to anon and authenticated", () => {
    expect(sql).toMatch(
      /grant execute on function get_primary_emergency_contact\(text\) to anon, authenticated/i
    );
  });

  it("does not use dynamic SQL", () => {
    expect(sql).not.toMatch(/\bexecute\s+format\b/i);
    expect(sql).not.toMatch(/\bexecute\s+'/i);
  });

  it("does not touch any pre-existing table, RLS policy, or index", () => {
    expect(sqlStatementsOnly).not.toMatch(/create policy/i);
    expect(sqlStatementsOnly).not.toMatch(/alter table/i);
    expect(sqlStatementsOnly).not.toMatch(/create table/i);
    expect(sqlStatementsOnly).not.toMatch(/create index/i);
    expect(sqlStatementsOnly).not.toMatch(/revoke all/i);
  });
});
