# Burp Tales

A personal food journal for logging recipes worth making again and restaurants worth going back to. Built with Next.js 16 App Router, React 19, TypeScript, and PostgreSQL.

**Live:** [burp-tales.vercel.app](https://burp-tales.vercel.app)

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS v4
- **Language:** TypeScript (strict mode)
- **Database:** PostgreSQL on Neon, Prisma ORM
- **Auth:** Better Auth with stateless JWE sessions, GitHub OAuth
- **Hosting:** Vercel

## Architecture Decisions

### Server Components by Default

Pages are async Server Components that fetch data directly with Prisma — no API layer, no client-side fetching, no loading spinners for the initial render. Client Components are used only where there's browser-side interactivity: search filtering, ingredient scaling, form state.

### Suspense Streaming

Both the recipes and restaurants list pages use the same pattern: the page shell (heading, navigation) renders immediately as a Server Component, while a nested async component fetches data inside a `<Suspense>` boundary. The browser receives the shell first, shows a skeleton, then streams in the data — all in a single HTTP response.

### Server Actions as Typed RPC

Create, update, and delete operations are Server Actions — colocated with the pages that use them, validated on the server, and called directly from forms. No REST endpoints, no manual fetch calls. The recipe form uses `useActionState` to surface field-level validation errors without losing user input.

### Single-Owner Auth Gate

This is a personal journal, not a multi-tenant app. Authentication uses a `validateUserInfo` gate that checks the GitHub user ID against an environment variable. If the ID doesn't match, sign-in fails — there's no user creation flow. The gate fails closed: an unset env var blocks everyone. `requireOwner()` is called at the top of every mutating Server Action.

### Design System with CSS Custom Properties

Seven design tokens (`--paper`, `--ink`, `--muted`, `--rule`, `--basil`, `--basil-contrast`, `--danger`) define the entire color palette. Light and dark modes are handled through `prefers-color-scheme` media queries — no JavaScript, no flash of wrong theme. Component classes (`.btn-primary`, `.field`, `.label`) are defined once in `globals.css` and used consistently across all pages.

### Client-Side Search with URL Sync

A shared `useSearch` hook manages search state and syncs it to the `?q=` query parameter using `replaceState` — no server round-trips, no history pollution. Each list component uses the hook and applies its own filtering logic: recipes filter by title and ingredients, restaurants filter by name, cuisine, and city.

### Ingredient Scaling with `useReducer`

The ingredient editor uses a pure reducer with four action types (`added`, `changed`, `removed`, `moved`) and a TypeScript exhaustiveness check via the `never` type. Side effects like `crypto.randomUUID()` stay in event handlers, not the reducer. The scale multiplier buttons (½×, 1×, 2×, 3×) use a separate `useState` — simple enough that a reducer would be overhead.

### Recipe URL Scraping

Adding a recipe by URL scrapes the page for structured data: JSON-LD `Recipe` schema first (handling both top-level and `@graph` formats), falling back to the page title and Open Graph image via Cheerio. The scraping runs server-side in a `useTransition` callback, and the form remounts with fetched data using a `key` prop reset.

## Project Structure

```
app/
├── layout.tsx          # Root layout (Server Component, fonts, nav)
├── page.tsx            # Home page with recent recipes
├── recipes/
│   ├── page.tsx        # Recipe list with Suspense streaming
│   ├── [id]/page.tsx   # Recipe detail with ingredient scaling
│   ├── [id]/edit/      # Edit form with bound Server Action
│   ├── new/            # New recipe with URL scraping
│   ├── actions.ts      # Server Actions (create, update, delete)
│   ├── error.tsx       # Error boundary
│   └── loading.tsx     # Skeleton loading UI
├── restaurants/
│   ├── page.tsx        # Restaurant list with Suspense streaming
│   ├── new/            # Log a visit form
│   └── actions.ts      # Server Actions (create visit)
└── login/              # Owner sign-in page

components/
├── SearchInput.tsx     # Shared search input + useSearch hook
├── RecipeList.tsx      # Client Component: search, filter, image grid
├── RestaurantList.tsx  # Client Component: search, filter, card grid
├── RecipeForm.tsx      # useActionState form with field-level errors
├── IngredientEditors.tsx  # useReducer with pure reducer
├── NewRecipeForm.tsx   # URL scraping with useTransition
├── ScaleIngredients.tsx   # Multiplier buttons with useState
├── DeleteRecipeButton.tsx # useTransition for Server Action outside form
├── NavLinks.tsx        # Client Component for active link (usePathname)
└── AuthButtons.tsx     # Sign in/out with GitHub OAuth

lib/
├── auth.ts             # Better Auth config (JWE, GitHub, owner gate)
├── auth-client.ts      # Client-side auth
├── owner.ts            # isOwner() / requireOwner() helpers
├── prisma.ts           # Singleton PrismaClient (dev hot-reload safe)
├── scrapeRecipe.ts     # JSON-LD → Cheerio fallback scraper
└── scaleIngredient.ts  # Regex-based ingredient amount scaling
```

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and GitHub OAuth credentials

# Generate Prisma client and run migrations
npx prisma generate
npx prisma db push

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon recommended) |
| `BETTER_AUTH_SECRET` | Random string for session encryption |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |
| `OWNER_GITHUB_ID` | Your GitHub user ID (only this account can sign in) |