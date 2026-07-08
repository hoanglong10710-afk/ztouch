# MASTER DEVELOPMENT PLAN — Z-TOUCH

This document is a planning artifact only. It does not change any application code. It reflects the state of the repository as read on 2026-07-08, cross-referenced against `docs/00_PROJECT_CONTEXT.md`, `docs/02_PRODUCT.md`, `docs/05_RULES.md`, `docs/06_DATABASE.md`, and `docs/08_UI.md` (the only docs with real content — `01_VISION.md`, `07_API.md`, `09_BUSINESS.md`, `10_SECURITY.md`, `11_DEPLOY.md`, `12_CHANGELOG.md`, `13_DECISIONS.md`, `14_PROMPTS.md`, and everything in `docs/ai/` are currently empty stubs).

Per `docs/00_PROJECT_CONTEXT.md` §2.10 and `05_RULES.md`, any phase below that falls outside current MVP scope must first get a PRODUCT/ROADMAP/DECISIONS doc update and explicit approval before code is written. Phases are flagged accordingly.

---

# Current Status

What already works today in `apps/web`:

- **Monorepo shell** — `apps/web` is the only active app; `packages/`, `scripts/`, `ztouch/`, and root `public/` are empty placeholders.
- **Auth (partial)** — Google OAuth sign-in via `supabase.auth.signInWithOAuth` (`app/login/page.tsx`). Session is checked client-side; on session detect, redirect to `/dashboard`.
- **Dashboard (basic)** — `app/dashboard/page.tsx` lists rows from the `cards` table filtered by `owner_id`, creates a new card with a random 6-character `public_id`, deletes a card, and signs out.
- **Profile editor (basic)** — `app/dashboard/edit/[id]/page.tsx` loads a single card by id and saves a fixed set of flat fields (title, display_name, job_title, company, phone, email, website, facebook, tiktok, youtube, instagram, linkedin, github, address, bio).
- **Public profile page** — `app/p/[publicId]/page.tsx` is a server component that looks up a card by `public_id` via `createServerSupabase()` and renders avatar, name, job title, bio, and any of the hardcoded contact/social links that are non-empty.
- **QR rendering** — `components/QRCodeDialog.tsx` renders a QR code for a profile's public URL using `react-qr-code`, but it is not yet wired into any page.
- **Design system foundation** — `components.json` (shadcn, style `base-nova`), Tailwind v4 tokens with both light and dark CSS variables already defined in `app/globals.css` (dark mode is unused today, but the variables exist), one primitive built: `components/ui/button.tsx` (via `@base-ui/react` + `class-variance-authority`).
- **Tooling** — TypeScript strict mode, ESLint flat config (`eslint-config-next`), path alias `@/*`.

No test runner is configured anywhere in the repo.

---

# Missing Features

Gaps between what `docs/00_PROJECT_CONTEXT.md` / `docs/02_PRODUCT.md` require for MVP (or describe as the intended data model in `docs/06_DATABASE.md`) and what exists in code:

- **Email/password auth** — register, login, forgot password, email verification. Only Google OAuth exists.
- **Server-side route protection** — no `middleware.ts`; `/dashboard` and `/dashboard/edit/[id]` are gated only by a client-side `useEffect` check.
- **Profile types** — `profile_type` is always hardcoded to `"personal"` on create; no UI exists to choose rescue / business / portfolio / pet / vehicle / student profiles as described in the docs.
- **Emergency contacts (Rescue Profile)** — `emergency_contacts` table and any related UI are entirely absent, despite being called the most important Rescue feature in the docs.
- **NFC management** — no `nfc_cards` table, no linking/relinking UI, no NFC write flow anywhere in the app.
- **Persisted, typed QR codes** — no `qr_codes` table; QR is generated ad hoc client-side from `public_id` and not tracked (no scan counts, no expiry, no multiple QR types).
- **Avatar/cover upload** — `avatar_url` is only ever populated by copying the Google OAuth `user_metadata.avatar_url`; there is no upload flow, and Supabase Storage is not used anywhere in the app.
- **Social links as data** — `profile_socials` (repeatable, orderable, platform-agnostic social links) does not exist; socials are hardcoded flat columns (`facebook`, `tiktok`, `youtube`, `instagram`, `linkedin`, `github`) with no way to add other platforms, reorder, hide, or track clicks.
- **Visibility & sharing controls** — `is_public`, `allow_search`, `allow_download_contact` have no UI (is_public is silently set `true` on create and never revisited).
- **Analytics** — no `profile_views` table, no view tracking, no analytics dashboard.
- **Theming** — no dark mode toggle wired up despite the CSS variables already existing; no per-profile `theme` selection.
- **Localization** — no `language` handling; UI strings are hardcoded Vietnamese.
- **Soft delete** — `deleted_at` is never used; the delete button performs a hard delete.
- **Audit logging** — no `audit_logs` table or writes anywhere.
- **Human-readable slugs** — only a random `public_id`; no `slug` field or custom-URL support.
- **Plan/role gating** — no `plan` (free/premium) or `role` (user/admin/super_admin) handling anywhere.
- **Business/Team profiles** — not started (also outside current MVP scope per docs).
- **vCard export** — not implemented, despite being implied by `allow_download_contact`.
- **Automated tests** — none exist (no Jest/Vitest/Playwright configured).
- **Database migrations** — no migration files are tracked in this repo at all; the live Supabase schema cannot currently be verified from source control.

---

# Refactoring

Concrete files that should be improved, and why:

1. **`app/dashboard/page.tsx`** — `useState<any>` for user/cards; all Supabase calls are inlined in the component with no data-access layer; feedback uses `alert()`/`confirm()`; card list markup is duplicated inline instead of a `CardListItem` component.
2. **`app/dashboard/edit/[id]/page.tsx`** and **`app/dashboard/edit/[id]/EditForm.tsx`** — near-total duplication: `page.tsx` renders its own copy of every field already implemented in `EditForm.tsx`, so `EditForm` is currently dead code (never imported/rendered by `page.tsx`). Both use `any`-typed card state, hand-rolled `<input>` elements instead of shadcn `Input`/`Textarea`, and no validation (no Zod schema, despite Zod being named as the validation tool in `docs/05_RULES.md`).
3. **`app/login/page.tsx`** — leftover `console.log("SESSION:", session)` / `console.log(event, session)` debug statements; only supports Google OAuth despite docs requiring email/password + forgot password.
4. **`app/p/[publicId]/page.tsx`** — a `// ===== DEBUG =====` block logs the public id, query result, and error on every request server-side; social platforms are handled via six near-identical hardcoded `{card.facebook && (...)}` blocks instead of iterating a data-driven list, which blocks adding a new platform without a code change; uses a plain `<img>` instead of `next/image`.
5. **`lib/supabase/server.ts`** — the "server" client uses the same public anon key as the browser client, so it gains nothing over `lib/supabase/client.ts` (no service-role usage, no cookie-based SSR session even though `@supabase/auth-helpers-nextjs` is installed specifically for that purpose).
6. **`types/card.ts`, `types/profile.ts`** — both empty. Every component that touches a card falls back to `any` instead of a shared type.
7. **`components/public/Footer.tsx`, `InfoButton.tsx`, `ProfileHeader.tsx`, `QRCard.tsx`, `SocialButton.tsx`** — all empty placeholder files; either implement them (Phase 5) or remove them so they don't read as finished scaffolding.
8. **`components/QRCodeDialog.tsx`** — reads `window.location.origin` directly during render; not referenced anywhere else in the app yet (dead code until wired up).
9. **`package.json`** — dependencies installed but referenced nowhere in source: `@supabase/auth-helpers-nextjs`, `@supabase/auth-ui-react`, `@supabase/auth-ui-shared`, `next-themes`, `uuid`. Two competing QR libraries are installed (`qrcode.react` and `react-qr-code`) though only `react-qr-code` is used — standardize on one.
10. **`app/layout.tsx`** — `metadata` still has the default `create-next-app` title/description ("Create Next App" / "Generated by create next app"), not the Z-TOUCH brand.
11. **Missing `middleware.ts`** — protected routes rely entirely on a client-side check, which ships page JS before redirecting and is worth fixing alongside the auth work in Phase 1.

---

# Development Roadmap

## Phase 1 — Authentication polish
**Objective:** Bring auth up to the documented MVP requirement (register, login, forgot password, email verification) alongside the existing Google OAuth flow, and move session gating server-side.
**Files:** `app/login/page.tsx`; new `app/register/page.tsx`, `app/forgot-password/page.tsx`; new `middleware.ts`; rework `lib/supabase/server.ts` to use a cookie-aware SSR client.
**Components:** `AuthForm`, `PasswordInput`; shadcn `Input`/`Label`/`Button`.
**Database changes:** None required — Supabase Auth manages credentials internally. Optional: an app-level `users` mirror table (per `docs/06_DATABASE.md` ch.1) if `plan`/`role`/`language`/`theme` need to live outside Supabase Auth's own user object.
**Estimated complexity:** Medium.
**Risks:** Supabase email templates/redirect config live outside this repo; changing the OAuth redirect flow can break the currently-working Google login; moving from `getSession()` calls scattered in client components to a server-verified session touches every page that currently reads auth state.

## Phase 2 — Dashboard redesign
**Objective:** Replace the current raw-div dashboard (`alert()`/`confirm()`, `any` state, inline markup) with a proper shadcn-based UI: card grid, empty state, loading skeletons, toast feedback.
**Files:** `app/dashboard/page.tsx`; new `components/dashboard/CardListItem.tsx`, `CreateCardButton.tsx`, `EmptyState.tsx`.
**Components:** shadcn `Card`, `Badge`, `Dropdown` (edit/view/delete menu), `Toast`/`Sonner`, `Skeleton`.
**Database changes:** None (still the `cards` table). Optionally switch delete to use `deleted_at` (soft delete) instead of a hard delete.
**Estimated complexity:** Medium.
**Risks:** Adding a toast primitive means installing a new shadcn component not yet in the repo; must preserve existing create/delete behavior while restructuring.

## Phase 3 — Profile editor
**Objective:** Consolidate the duplicated flat forms (`EditForm.tsx` + inline fields in `page.tsx`) into one typed, validated editor, and add `profile_type` selection (personal, rescue, business, portfolio, pet, vehicle, student).
**Files:** `app/dashboard/edit/[id]/page.tsx`, `app/dashboard/edit/[id]/EditForm.tsx` (merge into one); `types/card.ts` (define the real type).
**Components:** shadcn `Form` + `Input` + `Textarea` + `Select` (profile type); a Zod schema for validation.
**Database changes:** None for the existing flat `cards` fields. If this phase instead moves toward the normalized `profiles`/`profile_socials` schema in `docs/06_DATABASE.md`, that requires creating those tables plus a data migration — this is a real architectural fork and should be resolved in `docs/13_DECISIONS.md` before starting.
**Estimated complexity:** Medium.
**Risks:** Deciding "stay on flat `cards`" vs. "migrate to normalized schema" changes the shape of every later phase that touches profile data — decide this first.

## Phase 4 — Avatar & Cover Upload
**Objective:** Let users upload/replace an avatar and cover image via Supabase Storage instead of relying solely on the Google OAuth avatar URL.
**Files:** new `lib/supabase/storage.ts`; `app/dashboard/edit/[id]/EditForm.tsx` (add upload controls).
**Components:** `AvatarUploader`, `CoverUploader` (file input + preview).
**Database changes:** New Supabase Storage buckets (e.g. `avatars`, `covers`) with storage RLS policies. `cards.avatar_url` already exists; a `cover_url` column would need to be added if not already present.
**Estimated complexity:** Medium.
**Risks:** Storage bucket/RLS setup happens in the Supabase dashboard, not in this repo, so code and policy can silently drift; needs file size/type validation to prevent abuse.

## Phase 5 — Public profile redesign
**Objective:** Rework `/p/[publicId]` into the polished, mobile-first page described in `docs/08_UI.md` (Apple/Notion/Linear/Vercel/Spotify-inspired, generous whitespace, soft shadows); remove the debug logging block; drive social links from data instead of six hardcoded platform checks.
**Files:** `app/p/[publicId]/page.tsx`; implement the currently-empty `components/public/ProfileHeader.tsx`, `SocialButton.tsx`, `Footer.tsx`, `InfoButton.tsx`.
**Components:** `ProfileHeader`, `SocialButtonList`, `ContactActions` (call/email/website), `Footer`.
**Database changes:** None if staying on `cards`; requires the `profile_socials` table (and a join query) if that migration happened in Phase 3.
**Estimated complexity:** Medium.
**Risks:** OpenGraph/social preview metadata isn't handled yet and should be explicitly scoped in or deferred; must not break existing `public_id` links already issued.

## Phase 6 — QR Generator
**Objective:** Wire the existing but unused `QRCodeDialog` into the dashboard/edit flow, add PNG/SVG download.
**Files:** `components/QRCodeDialog.tsx`; render it from `app/dashboard/page.tsx` or the edit page; new `lib/qr.ts` for download helpers.
**Components:** `QRCodeDialog` (existing, needs integration), `QRDownloadButton`.
**Database changes:** Optional `qr_codes` table (per `docs/06_DATABASE.md`: `qr_token`, `qr_url`, `type`, `is_active`, `expire_at`, `scan_count`) if QR analytics or multiple QR types per profile are wanted; otherwise the existing `public_id` URL is sufficient for a single default QR.
**Estimated complexity:** Low–Medium.
**Risks:** Two QR libraries (`qrcode.react`, `react-qr-code`) are currently installed — standardize on one before building download support to avoid inconsistent output.

## Phase 7 — NFC Writer support
**Objective:** Add a UI flow to write a profile's public URL to an NFC tag (Web NFC API, Chrome on Android only) and manage NFC card records, including relinking a tag to a different profile without rewriting it.
**Files:** new `app/dashboard/nfc/page.tsx`; new `lib/nfc.ts` (Web NFC wrapper); new `components/dashboard/NfcCardList.tsx`.
**Components:** `NfcWriteButton`, `NfcCardListItem`, `RelinkProfileDialog`.
**Database changes:** New `nfc_cards` table per `docs/06_DATABASE.md` (`id`, `user_id`, `profile_id`, `nfc_uid`, `serial_number`, `status`, `activated_at`, `last_scan_at`, `scan_count`) — does not exist anywhere in the current implementation.
**Estimated complexity:** High.
**Risks:** Web NFC has no iOS Safari support, so a clear fallback message is required; writing physical tags is hard to test without real hardware; UID handling has real security implications the docs already flag ("never store personal data on the chip itself").

## Phase 8 — Analytics
**Objective:** Track profile views (device, browser, OS, referrer, NFC-vs-QR origin) and show basic stats to the profile owner.
**Files:** `app/p/[publicId]/page.tsx` (log a view server-side); new `app/dashboard/analytics/page.tsx`.
**Components:** `StatsCard`, `ViewsChart`, `DeviceBreakdown`.
**Database changes:** New `profile_views` table per `docs/06_DATABASE.md` (`profile_id`, `visitor_ip`, `country`, `city`, `device`, `browser`, `os`, `referrer`, `user_agent`, `is_nfc`, `is_qr`, `viewed_at`), with RLS restricting reads to the profile owner.
**Estimated complexity:** Medium–High.
**Risks:** IP/geolocation collection has privacy implications that must respect the "no data collection beyond operational purpose" principle in `docs/00_PROJECT_CONTEXT.md`; needs rate-limiting so the table doesn't grow unbounded from refreshes/bots.

## Phase 9 — Themes
**Objective:** Let users choose a visual theme per profile (the `theme` field is already named in the DB doc) and support app-wide dark mode — the CSS variables for dark mode already exist in `globals.css` but are never toggled.
**Files:** `app/globals.css` (already has `.dark` variables); new `components/ThemeProvider.tsx`; `app/dashboard/edit/[id]/EditForm.tsx` (theme picker).
**Components:** `ThemeToggle`, `ThemePicker` (per-profile); `ThemeProvider`, likely built on the already-installed but currently-unused `next-themes`.
**Database changes:** A `theme` column on `cards` (or the relevant profile table) to persist the selected theme per profile.
**Estimated complexity:** Medium.
**Risks:** Per-profile theme (public page) and app-wide dark mode (dashboard) are different concerns and shouldn't be conflated; confirm `next-themes` still fits before building on an unused dependency.

## Phase 10 — Team Profiles *(post-MVP — requires doc + approval update first)*
**Objective:** Organize a group of profiles under a shared team/organization (e.g. company employees), per the "Giai đoạn 3" phase in `docs/00_PROJECT_CONTEXT.md`.
**Files:** new `app/dashboard/teams/page.tsx`, `app/dashboard/teams/[teamId]/page.tsx`.
**Components:** `TeamList`, `TeamMemberList`, `InviteMemberDialog`.
**Database changes:** New `teams` and `team_members` tables (not present in `docs/06_DATABASE.md` at all — schema needs to be designed and documented before implementation).
**Estimated complexity:** High.
**Risks:** Explicitly out of current MVP scope — per `docs/00_PROJECT_CONTEXT.md` §2.10 this requires updating PRODUCT/ROADMAP/DECISIONS docs and explicit approval before any code is written; permissions (who can edit a team's profiles) add real complexity.

## Phase 11 — Business Profiles *(post-MVP — requires doc + approval update first)*
**Objective:** Purpose-built profile type for small businesses (hours, map, hotline, storefront links), matching Persona 05 in `docs/00_PROJECT_CONTEXT.md`.
**Files:** conditional rendering in `app/p/[publicId]/page.tsx` based on `profile_type === "business"`, or a dedicated variant; new `components/public/BusinessInfo.tsx`.
**Components:** `BusinessHours`, `MapLink`, `MenuLink`, `HotlineButton`.
**Database changes:** Extends the profile schema with business-specific fields (opening hours, map link) not currently defined in `docs/06_DATABASE.md` — needs a schema addition.
**Estimated complexity:** Medium.
**Risks:** Also post-MVP scope; risk of scope creep if not bounded to exactly the fields Persona 05 needs.

## Phase 12 — Subscription *(post-MVP — requires doc + approval update first)*
**Objective:** Premium plan gating (the `plan` field already exists on the `users` table in `docs/06_DATABASE.md`) — e.g. profile/NFC-card limits on Free, premium-only themes/analytics.
**Files:** new `app/dashboard/billing/page.tsx`; new `lib/billing.ts`; new `app/api/webhooks/payment/route.ts`.
**Components:** `PlanCard`, `UpgradeButton`, `PlanBadge`.
**Database changes:** `users.plan` column plus whatever tables the chosen payment provider requires (subscription id, status, renewal date) — no provider is specified in the docs yet.
**Estimated complexity:** High.
**Risks:** Real payment/compliance surface (PCI, invoicing, tax); `docs/00_PROJECT_CONTEXT.md` explicitly excludes recurring payments from MVP scope, so this must not start without a PRODUCT + DECISIONS update and explicit approval; webhook signature verification is easy to get wrong.

## Phase 13 — Admin Panel *(post-MVP — requires doc + approval update first)*
**Objective:** Internal tool for support/ops to look up users, profiles, and NFC cards, using the `role` field (`user`/`admin`/`super_admin`) already defined in `docs/06_DATABASE.md`.
**Files:** new `app/admin/page.tsx`, `app/admin/users/page.tsx`; extend `middleware.ts` (from Phase 1) with a role check.
**Components:** `AdminUserTable`, `AdminProfileTable`, `RoleBadge`.
**Database changes:** `users.role` column; `audit_logs` table (per `docs/06_DATABASE.md` ch.8) so admin actions are traceable.
**Estimated complexity:** High.
**Risks:** The highest-privilege surface in the app — needs strict RLS plus server-side role checks (not just UI hiding); every admin action must be written to `audit_logs` per the security rules in `docs/05_RULES.md`.

## Phase 14 — Performance
**Objective:** Audit and optimize load time, especially the public profile page, to meet the "a few seconds from NFC tap to display" target in `docs/00_PROJECT_CONTEXT.md`.
**Files:** `app/p/[publicId]/page.tsx` (caching/revalidation strategy, swap `<img>` for `next/image`); `next.config.ts` (image optimization, headers); `app/layout.tsx` (font loading review).
**Components:** None new — this phase audits existing ones.
**Database changes:** Add the indexes already named in `docs/06_DATABASE.md` (`slug`, `user_id`, `profile_type`, `is_public`, etc.) but never captured in a migration file.
**Estimated complexity:** Medium.
**Risks:** No migration files exist in this repo today, so there is no way to verify from source control which indexes are actually applied in the live Supabase project — this needs to be reconciled before claiming the work is done; overly aggressive caching on the public page risks serving stale data right after an edit.

## Phase 15 — Production Release
**Objective:** Final hardening and launch readiness — RLS audit across every table, error monitoring, custom domain, SEO basics, legal pages, and committing migration history to the repo for the first time.
**Files:** new `supabase/migrations/` (does not exist yet — no migration history is tracked in git); new `app/robots.ts`, `app/sitemap.ts`, `app/privacy/page.tsx`, `app/terms/page.tsx`.
**Components:** None new — mostly configuration/infrastructure.
**Database changes:** Freeze and export the actual production schema into versioned migrations (currently a gap — nothing in version control reflects the live schema); final RLS policy review against the per-table RLS notes in `docs/06_DATABASE.md`.
**Estimated complexity:** High.
**Risks:** Without migration files, "what's actually live in Supabase" is only knowable by inspecting the dashboard directly — this is a launch blocker, not routine cleanup; `docs/11_DEPLOY.md` is currently empty and needs to be written before this phase can be considered complete.
