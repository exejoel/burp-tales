import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import RecipeList from "@/components/RecipeList";
import { isOwner } from "@/lib/owner";

export const dynamic = "force-dynamic";

// The owner check only reads a cookie, so it's fast and the heading still
// arrives right away. Only the part inside <Suspense> waits for the database.
export default async function RecipesPage() {
  const canEdit = await isOwner();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-14">
      <header className="mb-10 text-center">
        <h1 className="font-display text-5xl font-medium tracking-tight">
          Recipes
        </h1>
        {canEdit && (
          <Link href="/recipes/new" className="btn-primary mt-6">
            Add recipe
          </Link>
        )}
      </header>

      <Suspense fallback={<RecipeListSkeleton />}>
        <RecipeListData />
      </Suspense>
    </main>
  );
}

// An async Server Component: React shows the Suspense fallback while this
// awaits, then streams the finished list into the same HTML response.
async function RecipeListData() {
  const rows = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
    // Select only what the list needs. Everything passed to a client
    // component is serialized into the page, so smaller is better.
    select: { id: true, title: true, ingredients: true, imageUrl: true },
  });

  // next/image only accepts hosts allowed in next.config.ts, and that allows
  // https only. Anything else (http, relative paths) gets the placeholder
  // tile instead of crashing the page.
  const recipes = rows.map(({ imageUrl, ...recipe }) => ({
    ...recipe,
    image: imageUrl?.startsWith("https://") ? imageUrl : null,
  }));

  if (recipes.length === 0) {
    return (
      <p className="text-center text-muted">
        No recipes yet.
      </p>
    );
  }
  return <RecipeList recipes={recipes} />;
}

// Same layout as the real list, so nothing jumps when the data arrives.
function RecipeListSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Loading recipes</span>
      <div className="skeleton mx-auto h-10 max-w-sm" />
      <div className="mt-3 mb-8 h-5" />
      <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <li key={i}>
            <div className="skeleton aspect-[4/3] rounded-2xl" />
            <div className="skeleton mt-4 h-6 w-3/4" />
            <div className="skeleton mt-2 h-4 w-1/2" />
          </li>
        ))}
      </ul>
    </div>
  );
}