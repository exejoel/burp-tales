import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import DeleteRecipeButton from "@/components/DeleteRecipeButton";
import { isOwner } from "@/lib/owner";
import ScaleIngredients from "@/components/ScaleIngredients";

export const dynamic = "force-dynamic";

function toLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

// sourceUrl came from user input. Only link to real web pages, never
// something like "javascript:...".
function isWebUrl(value: string | null): value is string {
  return !!value && /^https?:\/\//i.test(value);
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Two independent lookups, so run them at the same time.
  const [recipe, canEdit] = await Promise.all([
    prisma.recipe.findUnique({ where: { id } }),
    isOwner(),
  ]);

  if (!recipe) notFound();

  const ingredients = toLines(recipe.ingredients);
  const steps = toLines(recipe.steps);

  return (
    <main className="mx-auto w-full max-w-xl px-6 py-14">
      <Link href="/recipes" className="link-quiet">
        ← All recipes
      </Link>

      <header className="mt-10 mb-12 text-center">
        <h1 className="font-display text-5xl font-medium tracking-tight text-balance">
          {recipe.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {canEdit && (
            <>
              <Link href={`/recipes/${recipe.id}/edit`} className="btn-quiet">
                Edit
              </Link>
              <DeleteRecipeButton recipeId={recipe.id} recipeTitle={recipe.title} />
            </>
          )}
          {isWebUrl(recipe.sourceUrl) && (
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-quiet px-2"
            >
              Original recipe
            </a>
          )}
        </div>
      </header>
      <section aria-labelledby="ingredients-heading" className="mb-12">
        <h2 id="ingredients-heading" className="font-display text-2xl font-medium mb-3">
          Ingredients
        </h2>
        <p>Multiple the recipe by a factor of:</p>
        <ScaleIngredients ingredients={ingredients} />
      </section>

      <section aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="font-display text-2xl font-medium mb-4">
          Steps
        </h2>
        <ol className="space-y-5">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span
                aria-hidden="true"
                className="w-6 shrink-0 font-display text-2xl leading-none text-basil"
              >
                {i + 1}
              </span>
              <p className="leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
