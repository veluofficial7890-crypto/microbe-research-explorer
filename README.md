# Microbe Research Explorer

A responsive Expo + React Native Web application backed by Supabase. The same codebase can run as a website and as a mobile application.

## Included features

- Responsive landing page and navigation
- Microbe search with group, morphology, oxygen, temperature and pH filters
- Browse-by-group catalogue and detailed organism profiles
- Temperature and pH growth-response charts on organism profiles
- Side-by-side comparison of two organisms
- Taxonomic classification explorer
- Image explorer for profile image URLs
- Research library for references attached to profiles
- Learning centre and project information pages
- Supabase email/password authentication
- User-private saved microbes and recent searches
- Row-level security for user activity and administrator-only edits to shared microbe records

## Run locally

1. Install Node.js (LTS).
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and set your Supabase project URL and public anon key. The anon key is designed for browser use; never place a Supabase service-role key in this app.
4. Apply the SQL files in `supabase/migrations/` to your Supabase project, in filename order. If the original migration has already been applied, apply only the newer migration.
5. Start the app: `npm run dev`

## Build the website

Run `npm run build:web`. Expo writes the static web export to `dist/`. Deploy the contents of `dist/` to a static hosting provider. Configure the host to serve `index.html` for client-side routes if required by that host.

## Supabase setup notes

- Public microbe profiles are readable by anonymous and authenticated visitors.
- Saved microbes and recent searches are restricted to the signed-in owner by row-level security.
- Shared microbe create/update/delete operations are reserved for users whose Supabase Auth `app_metadata.role` claim is `admin`. Assign that claim from a trusted server/admin workflow, never from the client.
- Email confirmation settings are controlled in the Supabase Auth dashboard.
- The sample growth values are educational reference data. They are not universal strain-specific laboratory specifications or clinical guidance.

## Project structure

- `app/` — Expo Router routes and screens
- `lib/` — Supabase client, auth context, theme, shared navigation and feature pages
- `supabase/migrations/` — database schema and row-level security policies
- `assets/` — app icon and favicon
