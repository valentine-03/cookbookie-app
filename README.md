# CookBookie Project n4

CookBookie is a personal recipe collection with Supabase authentication, database-backed recipe CRUD, responsive navigation, category browsing, recipe photos, an account profile, theme variations, and a static nutrition reference guide.

## What this merge preserves

- Existing Supabase client, authentication, session persistence, recipe table, row-level security, and storage upload flow from `cookbookie-app`.
- The original CookBookie palette, typography direction, Material Symbols navigation, cards, forms, dashboard date widget, and guide presentation from `CookBookie_FinalProject_3`.
- The supplied Breakfast, Lunch, Dinner, and Dessert illustrations in `public/images/categories/`.
- Manual nutrition fields that a user already knows. The app does not calculate nutrition or call an external nutrition service.

## Main routes

- `/` — dashboard with account greeting, live date/time, categories, quick add entry point, and recently viewed recipes.
- `/recipes` — authenticated recipe collection with category filters and delete actions.
- `/recipes/:id` — recipe detail view; opening a recipe updates Recently Viewed.
- `/add` — recipe creation form connected to the existing Supabase database.
- `/nutrition-guide` — static nutrition reference and FAQ.
- `/settings` or `/account` — profile name, theme variation, preferences, and logout.
- `/login` and `/signup` — existing Supabase email authentication flow.

## Security

The archive intentionally does not include a `.env` file or secret values. Use `.env.example` as the template and keep your existing Supabase project variables private.