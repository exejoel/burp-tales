# Burp Tales

A personal food journal for logging recipes worth making again and restaurants worth going back to.

**Live:** [burp-tales.vercel.app](https://burp-tales.vercel.app)

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS v4
- **Language:** TypeScript
- **Database:** PostgreSQL on Neon, Prisma ORM
- **Auth:** Better Auth — stateless JWE sessions, GitHub OAuth
- **Testing:** Vitest
- **Hosting:** Vercel

## Project Structure

```
app/
├── layout.tsx             # Root layout, fonts, nav
├── page.tsx               # Home — recent recipes
├── recipes/
│   ├── page.tsx           # List (Suspense streaming)
│   ├── [id]/page.tsx      # Detail with ingredient scaling
│   ├── [id]/edit/         # Edit form
│   ├── new/               # Add recipe (URL scraping)
│   ├── actions.ts         # Server Actions
│   ├── error.tsx          # Error boundary
│   └── loading.tsx        # Skeleton
├── restaurants/
│   ├── page.tsx           # List (Suspense streaming)
│   ├── new/               # Log a visit
│   ├── actions.ts         # Server Actions
│   └── error.tsx          # Error boundary
└── login/                 # Owner sign-in

components/
├── SearchInput.tsx        # Shared search + useSearch hook
├── RecipeList.tsx         # Recipe grid with client-side filtering
├── RestaurantList.tsx     # Restaurant cards with client-side filtering
├── RecipeForm.tsx         # Form with field-level validation
├── IngredientEditors.tsx  # Ingredient list editor
├── NewRecipeForm.tsx      # URL scraping flow
├── ScaleIngredients.tsx   # Ingredient multiplier
├── DeleteRecipeButton.tsx # Delete with confirmation
├── NavLinks.tsx           # Active link highlighting
└── AuthButtons.tsx        # GitHub OAuth sign in/out

lib/
├── auth.ts                # Auth config
├── owner.ts               # Ownership checks
├── prisma.ts              # Database client
├── scrapeRecipe.ts        # Recipe URL scraper
└── scaleIngredient.ts     # Ingredient amount scaling
```

## Getting Started

```bash
npm install

# Set up environment variables
cp .env.example .env

# Generate Prisma client and push schema
npx prisma generate
npx prisma db push

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Random string for session encryption |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |
| `OWNER_GITHUB_ID` | Your GitHub user ID — only this account can sign in |