import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

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
      <h1 className="text-2xl font-semibold mt-2 mb-6">{recipe.title}</h1>

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
