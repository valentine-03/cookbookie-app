# CookBookie Project n4 setup

## Requirements

- Node.js 18 or newer
- npm 9 or newer
- An existing Supabase project used by `cookbookie-app`

## Local development

```bash
cd CookBookie_Project_n4
npm install
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite.

For a production bundle:

```bash
npm run build
npm run preview
```

## Environment variables

Create a local `.env` file with the same values already used by the existing application:

```bash
VITE_SUPABASE_URL=YOUR_EXISTING_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_EXISTING_SUPABASE_ANON_KEY
```

`VITE_SUPABASE_URL` points to the existing Supabase project. `VITE_SUPABASE_ANON_KEY` is the public anonymous client key. Never place a service-role key, password, token, or other private credential in frontend code or a committed file.

## Supabase connection and authentication

The client is initialized in `src/supabaseClient.js`. `src/context/AuthContext.jsx` keeps the existing email sign-up, email/password login, logout, session restore, and auth-state subscription behavior.

The app uses the existing `recipes` table and its row-level security policies. Recipe reads and CRUD operations live in `src/hooks/useRecipes.js`. Recipe images continue to use the existing `recipe-photos` storage bucket through `src/lib/photoUpload.js`.

The Account page stores the display name and preference values in the authenticated Supabase user's existing metadata. No duplicate profile table is created.

## Database

Use the existing schema and project. `supabase/schema.sql` documents the `recipes` table and policies; do not create a second database or project. If the existing project already has the table, do not run a replacement schema blindly.

## USDA removal

The USDA API, nutrition calculation module, API key variable, lookup UI, and external USDA link were removed. The Nutrition Guide remains as static educational content, and manual nutrition values remain optional fields for recipes.

## Vercel

Keep the existing Vercel project and deployment architecture. Set the two `VITE_SUPABASE_*` variables in the existing project's environment settings, then build this Vite app with `npm run build`. Do not create a second Vercel project.