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
    <main className="mx-auto w-full max-w-xl px-6 py-14">
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
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
    // Select only what the list needs. Everything passed to a client
    // component is serialized into the page, so smaller is better.
    select: { id: true, title: true, ingredients: true },
  });

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
      <div className="h-5 mb-8" />
      <ul className="menu">
        {[0, 1, 2].map((i) => (
          <li key={i} className="flex flex-col items-center gap-2">
            <div className="skeleton h-8 w-48" />
            <div className="skeleton h-4 w-64" />
          </li>
        ))}
      </ul>
    </div>
  );
}
