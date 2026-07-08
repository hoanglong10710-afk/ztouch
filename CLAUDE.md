# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This repo is a monorepo shell around a single active app:

- `apps/web` — the actual Next.js application. **All code work happens here.**
- `docs/` — Vietnamese-language product/engineering specs (see "Docs are the source of truth" below).
- `packages/`, `scripts/`, `ztouch/`, root `public/` — empty placeholders, not yet in use.

Since the real project lives in `apps/web`, `cd apps/web` before running any command below.

## Commands

Run from `apps/web`:

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run start    # run production build
npm run lint     # eslint (flat config, eslint-config-next)
```

There is no test runner configured in this repo (no Jest/Vitest/Playwright in `package.json`) — don't assume one exists.

## Tech stack

- Next.js 16 (App Router) on React 19, TypeScript, Tailwind CSS v4
- shadcn/ui (`components.json`: style `base-nova`, baseColor `neutral`, aliases `@/components`, `@/lib`, `@/components/ui`, `@/hooks`)
- Supabase (`@supabase/supabase-js`) for auth + database, Google OAuth as the only sign-in method
- `apps/web/AGENTS.md` warns this Next.js version has breaking changes vs. training data — check `node_modules/next/dist/docs/` before relying on API assumptions for anything non-trivial.

## Docs are the source of truth — read before non-trivial changes

`docs/00_PROJECT_CONTEXT.md` and `docs/05_RULES.md` declare the numbered `docs/*.md` files the single source of truth for product direction, database schema, and UI design — if code and docs disagree, the docs win until someone updates them. Key ones:

- `00_PROJECT_CONTEXT.md` — product vision, MVP scope (what's in/out), personas, workflow AI agents are expected to follow
- `05_RULES.md` — coding conventions (naming, TypeScript, React, Tailwind, git, security)
- `06_DATABASE.md` — the intended (normalized) database schema
- `08_UI.md` — design system (colors, spacing, component list)
- `07_API.md`, `11_DEPLOY.md`, `13_DECISIONS.md`, `15_AGENT_GUIDE.md` are currently empty stubs

Per these docs: don't change the DB schema, framework, or delete features without explicit approval, and don't add anything outside MVP scope (see `docs/00_PROJECT_CONTEXT.md` §2.5 for the explicit non-goals list: chat, AI chatbot, marketplace, payments, mobile app, crypto, etc.). If you're unsure whether something is in scope, ask rather than build it.

**Important divergence to know about:** `docs/06_DATABASE.md` specifies a normalized schema (`users`, `profiles`, `profile_socials`, `emergency_contacts`, `nfc_cards`, `qr_codes`, `profile_views`, `audit_logs` — explicitly forbidding flat social-link columns on `profiles`). The code actually implemented today queries a single flat Supabase table called `cards` with columns like `owner_id`, `public_id`, `title`, `profile_type`, `status`, `is_public`, plus flat `facebook`/`tiktok`/`youtube`/`instagram`/`linkedin`/`github` columns directly on the row. There are no migration files in the repo, so the live Supabase schema can't be verified from source — treat the docs as intent and the `cards` table usage in code as current reality, and flag the mismatch rather than silently assuming either one is authoritative.

Similarly, `05_RULES.md` asks for no `any`, no default exports, and a layered architecture (Presentation/Application/Domain/Infrastructure) — current code uses `any` liberally and default-exports every page/component (required by Next.js App Router conventions), with Supabase calls made directly inside `"use client"` components rather than a service layer. Don't assume the rules doc reflects current code; follow the doc's intent for new code but don't rewrite unrelated existing code to match it as a drive-by change.

## Architecture (current implementation)

- `app/page.tsx` — redirects `/` to `/login`
- `app/login/page.tsx` — Google OAuth sign-in via `supabase.auth.signInWithOAuth`; client-side redirects to `/dashboard` on session detect
- `app/dashboard/page.tsx` — lists/creates/deletes rows in the `cards` table for the signed-in user (`owner_id`); client-side session gating (no middleware-based route protection)
- `app/dashboard/edit/[id]/page.tsx` (+ `EditForm.tsx`) — loads and updates a single `cards` row by id
- `app/p/[publicId]/page.tsx` — public, server-rendered profile page; looks up `cards` by `public_id` using `createServerSupabase()`
- `lib/supabase/client.ts` — browser Supabase client (anon key)
- `lib/supabase/server.ts` — server-side Supabase client factory; currently uses the same public anon key as the client (no service-role/secret key is used anywhere) — if you need privileged server access, this needs to change, and RLS policies (declared in `06_DATABASE.md` per-table) should be verified in the Supabase dashboard since they aren't visible from this repo
- `components/public/*` (`Footer`, `InfoButton`, `ProfileHeader`, `QRCard`, `SocialButton`) and `types/{card,profile}.ts` are currently empty placeholder files — scaffolded but unimplemented
- `components/QRCodeDialog.tsx` — renders a QR code for a profile's public URL using `react-qr-code`

Env vars (`apps/web/.env.local`, not committed): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
