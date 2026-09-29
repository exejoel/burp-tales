import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import DeleteRecipeButton from "@/components/DeleteRecipeButton";
export const dynamic = "force-dynamic";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({ where: { id } });

  if (!recipe) notFound();

  return (
    <main className="max-w-2xl mx-auto p-8">
      <Link href="/recipes" className="text-sm text-gray-500 hover:underline">
        ← Back to recipes
      </Link>

      <div className="flex items-start justify-between gap-4 mt-2 mb-6">
        <h1 className="text-2xl font-semibold">{recipe.title}</h1>
        <div className="flex gap-2 shrink-0">
          <Link
            href={`/recipes/${recipe.id}/edit`}
            className="border px-3 py-1.5 rounded-md text-sm hover:bg-gray-50"
          >
            Edit
          </Link>
          <DeleteRecipeButton recipeId={recipe.id} recipeTitle={recipe.title} />
        </div>
      </div>

      <section className="mb-6">
        <h2 className="font-medium mb-2">Ingredients</h2>
        <p className="whitespace-pre-line text-gray-700">{recipe.ingredients}</p>
      </section>

      <section>
        <h2 className="font-medium mb-2">Steps</h2>
        <p className="whitespace-pre-line text-gray-700">{recipe.steps}</p>
      </section>
    </main>
  );
}