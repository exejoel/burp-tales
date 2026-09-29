import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import RecipeForm from "@/components/RecipeForm";
import { updateRecipe } from "../../actions";
import { isOwner } from "@/lib/owner";

export const dynamic = "force-dynamic";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Checked before the database query: visitors get a 404 and cost nothing.
  if (!(await isOwner())) notFound();

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
    <main className="mx-auto w-full max-w-xl px-6 py-14">
      <Link href={`/recipes/${recipe.id}`} className="link-quiet">
        ← Cancel
      </Link>
      <h1 className="mt-10 mb-10 font-display text-5xl font-medium tracking-tight">
        Edit recipe
      </h1>

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
