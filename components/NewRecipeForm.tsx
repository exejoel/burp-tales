"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createRecipe, fetchRecipeFromUrl } from "@/app/recipes/actions";
import RecipeForm, { type RecipeFormValues } from "@/components/RecipeForm";

// The interactive part of the Add page. The page itself (a Server
// Component) checks that you're the owner before rendering this.
export default function NewRecipeForm() {
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
    <main className="mx-auto w-full max-w-xl px-6 py-14">
      <Link href="/recipes" className="link-quiet">
        ← All recipes
      </Link>
      <h1 className="mt-10 mb-10 font-display text-5xl font-medium tracking-tight">
        Add a recipe
      </h1>

      <section className="mb-10 border-b border-rule pb-10">
        <label htmlFor="recipe-url" className="label">
          Start from a link (optional)
        </label>
        <div className="flex gap-2">
          <input
            id="recipe-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            aria-describedby="recipe-url-hint"
            className="field min-w-0 flex-1"
          />
          <button
            type="button"
            onClick={handleFetch}
            disabled={isFetching || !url}
            className="btn-quiet shrink-0"
          >
            {isFetching ? "Fetching..." : "Fetch"}
          </button>
        </div>
        <p id="recipe-url-hint" className="mt-1.5 text-sm text-muted">
          Fills in the title, ingredients, and steps when the page lists them.
        </p>
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
      </section>

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
