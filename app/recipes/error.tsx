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
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-xl font-semibold mb-2">Couldn&apos;t load this page</h1>
      <p className="text-gray-500 mb-4">
        The recipe database may be slow to respond. Try again in a moment.
      </p>
      <div className="flex gap-2">
        {/* unstable_retry re-fetches the server data and re-renders.
            The older reset() only re-renders, so a failed database
            query would just fail again. */}
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="bg-black text-white px-4 py-2 rounded-md text-sm"
        >
          Try again
        </button>
        <Link href="/" className="border px-4 py-2 rounded-md text-sm">
          Go home
        </Link>
      </div>
    </main>
  );
}
