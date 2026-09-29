"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Only the fields the list needs. The server page selects exactly these,
// so the client never receives the full recipe (steps, image, etc.).
export type RecipeSummary = {
  id: string;
  title: string;
  ingredients: string;
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
          the count appears, and the list below doesn't jump. */}
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
        <ul className="menu">
          {filteredRecipes.map((recipe) => {
            const preview = ingredientPreview(recipe.ingredients);
            return (
              <li key={recipe.id}>
                <Link
                  href={`/recipes/${recipe.id}`}
                  className="group block text-center"
                >
                  <h2 className="font-display text-3xl font-medium text-balance transition-colors group-hover:text-basil">
                    {recipe.title}
                  </h2>
                  {preview && (
                    <p className="mt-1.5 text-sm text-muted text-balance">
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
