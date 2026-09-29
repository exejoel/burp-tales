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

const inputClass = "border rounded-md px-3 py-2 text-gray-900 bg-white";

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

// Pure helper, outside the component: easy to read and easy to test.
function matchesSearch(recipe: RecipeSummary, query: string): boolean {
  if (query === "") return true;
  return (
    recipe.title.toLowerCase().includes(query) ||
    recipe.ingredients.toLowerCase().includes(query)
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
      <input
        type="search"
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Search by title or ingredient"
        aria-label="Search recipes"
        className={`${inputClass} w-full mb-6`}
      />

      {isFiltering && (
        <p className="text-sm text-gray-500 mb-3" aria-live="polite">
          Showing {filteredRecipes.length} of {recipes.length} recipes
        </p>
      )}

      {filteredRecipes.length === 0 ? (
        <div className="text-gray-500">
          <p>No recipes match “{search.trim()}”.</p>
          <button
            type="button"
            onClick={clearSearch}
            className="mt-2 text-sm underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredRecipes.map((recipe) => (
            <li key={recipe.id}>
              <Link
                href={`/recipes/${recipe.id}`}
                className="block border rounded-lg p-4 hover:bg-gray-50"
              >
                <h2 className="font-medium">{recipe.title}</h2>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}