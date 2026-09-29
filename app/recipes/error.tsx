"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";

// Catches errors anywhere under /recipes: the list, a recipe, the new and
// edit pages, and Server Actions like deleteRecipe that throw.
export default function RecipesError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Swap this for an error reporting service later.
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl font-medium tracking-tight">
        Couldn&apos;t load this page
      </h1>
      <p className="mt-3 text-muted">
        The recipe database may be slow to respond. Try again in a moment.
      </p>
      <div className="mt-8 flex justify-center gap-2">
        {/* unstable_retry re-fetches the server data and re-renders.
            The older reset() only re-renders, so a failed database
            query would just fail again. */}
        <button type="button" onClick={() => unstable_retry()} className="btn-primary">
          Try again
        </button>
        <Link href="/" className="btn-quiet">
          Go home
        </Link>
      </div>
    </main>
  );
}
