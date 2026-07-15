# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website rebuild for Solis and Luna Arts, a 501(c)(3) nonprofit focused on therapeutic arts. React + Vite frontend backed by Supabase (Postgres, Auth, Storage).

## Commands

Run from the repo root (the main Vite app):

```
npm run dev        # start Vite dev server
npm run build       # production build
npm run preview     # preview a production build locally
npm run lint         # oxlint
```

There is no test runner configured yet.

The `sponsor-logos/` directory is a separate, standalone Node project (its own `package.json`, not part of the Vite app or its build). It holds one-off admin/data-migration scripts and is run manually with `node <script>.cjs` from inside that directory — see "Data migration scripts" below.

## Architecture

- **Entry point**: `src/main.jsx` mounts `App` and imports Bootstrap's CSS globally.
- **Routing**: `src/App.jsx` wraps everything in `react-router-dom`'s `BrowserRouter` and defines all routes. `NavigationBar` is rendered outside `<Routes>` so it's persistent across pages. Page components (`Home.jsx`, `Region.jsx`, `Test*.jsx`) live flat in `src/`, not in a `pages/` subfolder.
- **Supabase client**: `src/lib/supabase.js` creates a single client from `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (env vars, Vite-prefixed). Components import `{ supabase }` from this module directly and query it in `useEffect` (see `Test.jsx`, `Test2.jsx` for the pattern: fetch a table or list a storage bucket, build public URLs from storage objects via `getPublicUrl`).
- **UI**: Uses `react-bootstrap` components (`Navbar`, `Nav`, `Card`, etc.) plus Bootstrap's CSS — not a custom design system.
- **Build tooling**: Vite config (`vite.config.js`) enables the React Compiler via `@vitejs/plugin-react`'s `reactCompilerPreset` combined with `@rolldown/plugin-babel` (Vite is on the Rolldown-based build, not standard Rollup).
- **Test/scratch routes**: `Test.jsx`, `Test2.jsx`, `Test3.jsx` and their `/test`, `/test2`, `/test3` routes are throwaway pages used to prototype Supabase queries (fetching a `posts` table, listing files in a `sponsors` storage bucket). Expect these to be replaced/removed as real pages are built.

### Supabase schema (inferred from code, not formally documented)

- `profiles` table: `id` (matches Supabase Auth user id), `full_name`, `email`, `role` (e.g. `'admin'`), `headshot_url`. RLS restricts writes — most mutations to other users' rows require the service-role key.
- `sponsors` table: `name`, `image_url`.
- Storage buckets: `sponsors`, `headshots` (both public; files uploaded and referenced via `getPublicUrl`).

### Data migration / admin scripts (`sponsor-logos/`)

One-off Node scripts for seeding Supabase, run manually and independently of the Vite app:

- `create-executives.cjs` — bulk-creates Supabase Auth users from `executives.json` and upserts matching `profiles` rows. Requires `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS; needed for admin-created auth users).
- `upload-headshots.cjs` — uploads images from `headshots.json` to the `headshots` bucket and sets `profiles.headshot_url` by matching on email. Also requires the service-role key.
- `upload-sponsors.cjs` — uploads images from `sponsors.json` to the `sponsors` bucket and inserts rows into `sponsors`. Unlike the other two, this one uses the anon key and signs in as an admin user (`ADMIN_EMAIL`/`ADMIN_PASSWORD`) so writes go through RLS as that admin.

These scripts expect to be run from inside `sponsor-logos/` with the referenced `.json` roster/mapping files and image assets present alongside them.

## Environment variables

- App (`.env` at repo root, see `.env.example`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Migration scripts (`sponsor-logos/.env`, not committed): additionally need `SUPABASE_SERVICE_ROLE_KEY` and, for `upload-sponsors.cjs`, `ADMIN_EMAIL`/`ADMIN_PASSWORD`. The service-role key bypasses Row Level Security — never expose it in frontend code or commit it.