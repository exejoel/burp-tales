import { prisma } from "@/lib/prisma";
import Link from "next/link";
import RecipeList from "../../components/RecipeList";

export const dynamic = "force-dynamic";

// Server Component: talks to the database, ships no JavaScript of its own.
export default async function RecipesPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
    // Select only what the list needs. Everything passed to a client
    // component is serialized into the page, so smaller is better.
    select: { id: true, title: true, ingredients: true },
  });

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

      {recipes.length === 0 ? (
        <p className="text-gray-500">No recipes yet. Add your first one.</p>
      ) : (
        <RecipeList recipes={recipes} />
      )}
    </main>
  );
}