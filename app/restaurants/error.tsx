"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";

export default function RestaurantsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl font-medium tracking-tight">
        Couldn&apos;t load this page
      </h1>
      <p className="mt-3 text-muted">
        The database may be slow to respond. Try again in a moment.
      </p>
      <div className="mt-8 flex justify-center gap-2">
        <button type="button" onClick={() => reset()} className="btn-primary">
          Try again
        </button>
        <Link href="/" className="btn-quiet">
          Go home
        </Link>
      </div>
    </main>
  );
}