"use client";

import { useState, useTransition } from "react";
import { createRecipe, fetchRecipeFromUrl } from "../actions";
import RecipeForm, { type RecipeFormValues } from "@/components/RecipeForm";

export default function NewRecipePage() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isFetching, startFetching] = useTransition();

  // Values from the last URL fetch, used to seed the form.
  const [fetched, setFetched] = useState<RecipeFormValues | undefined>();
  // Changing this number changes the form's `key`, so React mounts a
  // fresh form (and a fresh ingredient editor) seeded with `fetched`.
  const [fetchCount, setFetchCount] = useState(0);

  function handleFetch() {
    setError(null);
    if (!url) return;
    startFetching(async () => {
      try {
        const data = await fetchRecipeFromUrl(url);
        setFetched({
          title: data.title,
          ingredients: data.ingredients ?? "",
          steps: data.steps ?? "",
          sourceUrl: url,
          imageUrl: data.imageUrl || "",
        });
        setFetchCount((count) => count + 1);

        if (!data.ingredients && !data.steps) {
          setError(
            "No structured recipe data found on this page. The title and image were filled in; add the ingredients and steps yourself."
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't fetch that URL.");
      }
    });
  }

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Add a recipe</h1>

      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <label
          htmlFor="recipe-url"
          className="block text-sm font-medium mb-1 text-gray-900"
        >
          Paste a recipe URL (optional)
        </label>
        <div className="flex gap-2">
          <input
            id="recipe-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 border rounded-md px-3 py-2 text-gray-900 bg-white"
          />
          <button
            type="button"
            onClick={handleFetch}
            disabled={isFetching || !url}
            className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
          >
            {isFetching ? "Fetching..." : "Fetch"}
          </button>
        </div>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>

      <RecipeForm
        key={fetchCount}
        action={createRecipe}
        initialValues={fetched}
        submitLabel="Save recipe"
        pendingLabel="Saving..."
      />
    </main>
  );
}