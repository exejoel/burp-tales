import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import RecipeList from "@/components/RecipeList";

export const dynamic = "force-dynamic";

// No `async` and no data here, so the heading and Add button are sent
// right away. Only the part inside <Suspense> waits for the database.
export default function RecipesPage() {
  return (
    <main className="max-w-3xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Recipes</h1>
        <Link
          href="/recipes/new"
          className="bg-black text-white px-4 py-2 rounded-md text-sm"
        >
          Add recipe
        </Link>
      </div>

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
    return <p className="text-gray-500">No recipes yet. Add your first one.</p>;
  }
  return <RecipeList recipes={recipes} />;
}

const block = "bg-gray-400/20 rounded-md animate-pulse motion-reduce:animate-none";

// Same layout as the real list (search box, then rows), so nothing
// jumps around when the data arrives.
function RecipeListSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Loading recipes</span>
      <div className={`${block} h-10 mb-6`} />
      <ul className="space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="border border-gray-400/20 rounded-lg p-4">
            <div className={`${block} h-5 w-1/2`} />
          </li>
        ))}
      </ul>
    </div>
  );
}