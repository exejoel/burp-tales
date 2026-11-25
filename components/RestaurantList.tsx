"use client";

import SearchInput, { useSearch } from "@/components/SearchInput";

export type RestaurantSummary = {
  id: string;
  name: string;
  cuisine: string | null;
  city: string | null;
  latestRating: number | null;
};

type RestaurantListProps = {
  restaurants: RestaurantSummary[];
};

function matchesSearch(r: RestaurantSummary, query: string): boolean {
  if (query === "") return true;
  return (
    r.name.toLowerCase().includes(query) ||
    (r.cuisine?.toLowerCase().includes(query) ?? false) ||
    (r.city?.toLowerCase().includes(query) ?? false)
  );
}

export default function RestaurantList({ restaurants }: RestaurantListProps) {
  const { search, query, handleChange, clear } = useSearch();

  const filtered = restaurants.filter((r) => matchesSearch(r, query));
  const isFiltering = query !== "";

  return (
    <div>
      <SearchInput
        search={search}
        onChange={handleChange}
        placeholder="Search by name, cuisine, or city"
        label="Search restaurants"
      />

      <p
        aria-live="polite"
        className="mt-3 mb-8 h-5 text-center text-sm text-muted"
      >
        {isFiltering &&
          `${filtered.length} of ${restaurants.length} restaurants`}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center">
          <p className="text-muted">
            No restaurants match &ldquo;{search.trim()}&rdquo;.
          </p>
          <button type="button" onClick={clear} className="btn-quiet mt-4">
            Clear search
          </button>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <li key={r.id} className="rounded-2xl border border-rule p-5">
              <h2 className="font-display text-xl font-medium">{r.name}</h2>
              <p className="mt-1 text-sm text-muted">
                {r.cuisine} {r.city && `· ${r.city}`}
              </p>
              {r.latestRating && (
                <p className="mt-2 text-sm text-muted">
                  Latest rating:{" "}
                  <span className="font-medium text-ink">
                    {r.latestRating}/5
                  </span>
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}