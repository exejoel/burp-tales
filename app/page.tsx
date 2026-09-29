import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const sections = [
  { href: "/recipes", title: "Recipes", description: "Dishes you cook at home" },
  { href: "/restaurants", title: "Restaurants", description: "Places you've eaten out" },
];

// The cover of the menu: the name, the two sections, and what's new.
// Like the recipes page, everything except the database part is sent
// immediately.
export default function Home() {
  return (
    <main className="mx-auto w-full max-w-xl px-6 py-20 text-center">
      <h1 className="font-display text-6xl font-semibold italic tracking-tight sm:text-7xl">
        Burp Tales
      </h1>
      <p className="mt-4 text-muted text-balance">
        Recipes worth making again, and restaurants worth going back to.
      </p>

      <nav aria-label="Sections" className="mt-14 border-y border-rule">
        <ul className="grid divide-y divide-rule sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
          {sections.map((section) => (
            <li key={section.href}>
              <Link href={section.href} className="group block px-4 py-8">
                <span className="block font-display text-3xl font-medium transition-colors group-hover:text-basil">
                  {section.title}
                </span>
                <span className="mt-1 block text-sm text-muted">
                  {section.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Suspense fallback={<RecentRecipesSkeleton />}>
        <RecentRecipes />
      </Suspense>
    </main>
  );
}

async function RecentRecipes() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { id: true, title: true },
  });

  // Nothing to show yet: leave the section out rather than show an
  // empty heading. The Recipes link above is the way in.
  if (recipes.length === 0) return null;

  return (
    <section aria-labelledby="recent-heading" className="mt-16">
      <h2 id="recent-heading" className="mb-8 text-sm text-muted">
        Recently added
      </h2>
      <ul className="menu">
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <Link
              href={`/recipes/${recipe.id}`}
              className="font-display text-2xl font-medium text-balance transition-colors hover:text-basil"
            >
              {recipe.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RecentRecipesSkeleton() {
  return (
    <div role="status" className="mt-16 flex flex-col items-center gap-8">
      <span className="sr-only">Loading recent recipes</span>
      <div className="skeleton h-4 w-28" />
      <div className="skeleton h-7 w-48" />
      <div className="skeleton h-7 w-40" />
    </div>
  );
}