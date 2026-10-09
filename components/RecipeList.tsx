"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Only the fields the list needs. The server page selects exactly these,
// so the client never receives the full recipe (steps, notes, etc.).
export type RecipeSummary = {
  id: string;
  title: string;
  ingredients: string;
  image: string | null;
};

type RecipeListProps = {
  recipes: RecipeSummary[];
};

// Write the search to the URL without adding history entries or
// asking the server for anything. An empty search is left out, so an
// unfiltered list stays at plain /recipes.
function syncUrl(search: string) {
  const params = new URLSearchParams(window.location.search);

  if (search.trim()) params.set("q", search);
  else params.delete("q");

  const qs = params.toString();
  window.history.replaceState(
    null,
    "",
    qs ? `?${qs}` : window.location.pathname
  );
}

// Pure helpers, outside the component: easy to read and easy to test.
function matchesSearch(recipe: RecipeSummary, query: string): boolean {
  if (query === "") return true;
  return (
    recipe.title.toLowerCase().includes(query) ||
    recipe.ingredients.toLowerCase().includes(query)
  );
}

// The line under each dish name, like a menu description:
// "ghee, paneer, palak" or "flour, eggs, milk, butter, sugar, and 3 more".
function ingredientPreview(text: string, max = 5): string {
  const items = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const shown = items.slice(0, max).join(", ");
  const extra = items.length - max;
  return extra > 0 ? `${shown}, and ${extra} more` : shown;
}

// Full class strings, not built from pieces, so Tailwind can find them
// when it scans the source.
const PLACEHOLDER_TINTS = [
  "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
];

// Same id, same tint, on every render and every visit. Based on the id,
// not the title, so renaming a recipe doesn't change its color.
function tintFor(id: string): string {
  let hash = 0;
  for (const char of id) hash = (hash + char.charCodeAt(0)) % 997;
  return PLACEHOLDER_TINTS[hash % PLACEHOLDER_TINTS.length];
}

// A steaming bowl, drawn with strokes so it takes the tint's text color.
function BowlIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      className="size-12 opacity-70"
    >
      <path d="M3 12h18a9 8 0 0 1-18 0Z" />
      <path d="M8.5 8.5c0-1.5 1-1.75 1-3.25M12 8.5c0-1.5 1-1.75 1-3.25M15.5 8.5c0-1.5 1-1.75 1-3.25" />
    </svg>
  );
}

// The card's image area. Scraped images live on other people's sites and
// can disappear later, so a failed load falls back to the same tile as a
// recipe with no image. Each card has its own `failed` state because the
// list is keyed by recipe id.
function RecipeImage({ recipe }: { recipe: RecipeSummary }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = recipe.image && !failed;

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
      {showPhoto ? (
        // alt="" because the title right under it already names the dish;
        // a screen reader would otherwise read the name twice.
        <Image
          src={recipe.image!}
          alt=""
          fill
          // Tells the browser how wide the card is at each breakpoint,
          // so it downloads a small file on phones and a sharp one on desktop.
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
          onError={() => setFailed(true)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          aria-hidden="true"
          className={`flex size-full items-center justify-center transition-transform duration-500 group-hover:scale-105 ${tintFor(recipe.id)}`}
        >
          <BowlIcon />
        </div>
      )}
    </div>
  );
}

export default function RecipeList({ recipes }: RecipeListProps) {
  const searchParams = useSearchParams();

  // Lazy initializer: read the URL once, on the first render.
  // This works on the server too, so a shared link like
  // /recipes?q=egg arrives already filtered, with no flash.
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");

  // Derived state: calculated on every render, never stored.
  const query = search.trim().toLowerCase();
  const filteredRecipes = recipes.filter((recipe) =>
    matchesSearch(recipe, query)
  );

  const isFiltering = query !== "";

  // The event handler updates state and the URL together. No useEffect:
  // the URL changes because the user did something, so the handler
  // is the right place for it.
  function handleSearchChange(value: string) {
    setSearch(value);
    syncUrl(value);
  }

  function clearSearch() {
    setSearch("");
    syncUrl("");
  }

  return (
    <div>
      <div className="mx-auto max-w-sm">
        <input
          type="search"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by dish or ingredient"
          aria-label="Search recipes"
          className="field"
        />
      </div>

      {/* Always rendered, so screen readers are already watching it when
          the count appears, and the grid below doesn't jump. */}
      <p aria-live="polite" className="mt-3 mb-8 h-5 text-center text-sm text-muted">
        {isFiltering && `${filteredRecipes.length} of ${recipes.length} recipes`}
      </p>

      {filteredRecipes.length === 0 ? (
        <div className="text-center">
          <p className="text-muted">No recipes match “{search.trim()}”.</p>
          <button type="button" onClick={clearSearch} className="btn-quiet mt-4">
            Clear search
          </button>
        </div>
      ) : (
        <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => {
            const preview = ingredientPreview(recipe.ingredients, 4);
            return (
              <li key={recipe.id}>
                <Link href={`/recipes/${recipe.id}`} className="group block">
                  <RecipeImage recipe={recipe} />
                  <h2 className="mt-4 font-display text-xl font-medium text-balance transition-colors group-hover:text-basil">
                    {recipe.title}
                  </h2>
                  {preview && (
                    <p className="mt-1 line-clamp-1 text-sm text-muted">
                      {preview}
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}