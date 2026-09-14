import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function RecipesPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
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
        <p className="text-gray-500">No recipes yet — add your first one.</p>
      ) : (
        <ul className="space-y-3">
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <Link
                href={`/recipes/${recipe.id}`}
                className="block border rounded-lg p-4 hover:bg-gray-50"
              >
                <h2 className="font-medium">{recipe.title}</h2>
                {recipe.rating && (
                  <p className="text-sm text-gray-500">Rating: {recipe.rating}/5</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
