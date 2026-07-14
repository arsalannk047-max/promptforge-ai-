# PromptForge AI

An AI prompt generator, improver, converter, and public prompt library — built with Next.js 15, TypeScript, Tailwind, and Supabase.

## Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, React Hook Form + Zod, TanStack Query
- **Backend:** Next.js Route Handlers + Server Actions
- **Auth:** Supabase Auth (email/password + Google + GitHub OAuth)
- **Database:** Supabase Postgres, with Row Level Security on every table
- **AI:** OpenAI API (runs in a clearly-labeled demo mode until you add a key)

## Getting started

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Already filled in — points at the connected Supabase project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API (**server-only, never expose to the client**) |
| `OPENAI_API_KEY` | platform.openai.com → API keys. **Optional** — the app runs fine without it, generation/improve/convert just return clearly-labeled demo output until it's set. |

Then:

```bash
npm run dev
```

## Database

All tables, RLS policies, and triggers already exist on the connected Supabase project (see `supabase/migrations` if you export them, or re-run the SQL in this README's companion migration files). Key tables:

`profiles`, `categories`, `tags`, `prompts`, `prompt_tags`, `collections`, `collection_prompts`, `prompt_likes`, `prompt_bookmarks`, `comments`, `follows`, `generation_history`, `notifications`, `subscriptions`, `reports`, `site_settings`.

Every table has Row Level Security enabled. Public prompts are readable by anyone; private prompts, drafts, and history are scoped to their owner. Admin/moderator roles get elevated read/write via a `is_admin()` helper function.

## OAuth setup

Google and GitHub sign-in are wired into the app already (`/login`, `/signup` buttons + `/auth/callback` route). To activate them:

1. Supabase dashboard → Authentication → Providers
2. Enable **Google**: create an OAuth Client ID in Google Cloud Console, add the Supabase callback URL as an authorized redirect URI, paste the client ID/secret into Supabase.
3. Enable **GitHub**: create an OAuth App in GitHub Developer Settings, same pattern.

No app-level env vars are needed for OAuth — it's entirely configured in the Supabase dashboard.

## Enabling real AI generation

The app ships in **demo mode**: `/dashboard/generate`, `/improve`, and `/convert` work end-to-end, but return placeholder text until `OPENAI_API_KEY` is set in your environment. Once it's set (locally in `.env.local`, or in Vercel's project environment variables), no code changes are needed — `lib/ai/openai.ts` detects the key automatically.

## Deployment

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Add the environment variables from `.env.example` in Vercel's project settings.
4. Deploy.

## Folder structure

```
app/                  Route handlers, pages, layouts (App Router)
  (marketing)/        Landing page group
  (auth)/             Login, signup, forgot-password + server actions
  (dashboard)/         Authenticated app shell
  admin/               Admin panel (role-gated)
  library/             Public prompt library
  api/                 REST-style route handlers
components/
  ui/                  Design system primitives
  landing/ dashboard/ prompt/ library/ admin/ shared/
lib/
  supabase/            Browser/server/middleware Supabase clients
  ai/                  OpenAI service abstraction
  validations/         Zod schemas shared by forms + API routes
  utils/               Small shared helpers
providers/             App-wide React providers
types/                 Hand-authored Supabase types
```

## Known follow-ups

- Stripe billing is stubbed (plan display + admin subscriptions view exist; checkout/webhooks are not wired up — add `lib/stripe.ts` + a webhook route when ready).
- `npm run db:types` regenerates `types/database.ts` from the live schema via the Supabase CLI once you have it linked locally.
