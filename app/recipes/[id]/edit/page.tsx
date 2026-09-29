import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import RecipeForm from "@/components/RecipeForm";
import { updateRecipe } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      ingredients: true,
      steps: true,
      sourceUrl: true,
      imageUrl: true,
    },
  });

  if (!recipe) notFound();

  return (
    <main className="max-w-xl mx-auto p-8">
      <Link
        href={`/recipes/${recipe.id}`}
        className="text-sm text-gray-500 hover:underline"
      >
        ← Cancel
      </Link>
      <h1 className="text-2xl font-semibold mt-2 mb-6">Edit recipe</h1>

      <RecipeForm
        action={updateRecipe.bind(null, recipe.id)}
        initialValues={{
          title: recipe.title,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          sourceUrl: recipe.sourceUrl ?? "",
          imageUrl: recipe.imageUrl ?? "",
        }}
        submitLabel="Save changes"
        pendingLabel="Saving..."
      />
    </main>
  );
}