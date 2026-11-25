"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

// Write the search to the URL without adding history entries or
// asking the server for anything. An empty search is left out, so an
// unfiltered list stays at a clean path.
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

/**
 * Manages client-side search state synced with the ?q= query parameter.
 * Each list component calls this hook and uses the returned `query` to
 * filter its own data — filtering logic stays in the list, not here.
 */
export function useSearch() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");

  function handleChange(value: string) {
    setSearch(value);
    syncUrl(value);
  }

  function clear() {
    setSearch("");
    syncUrl("");
  }

  const query = search.trim().toLowerCase();

  return { search, query, handleChange, clear } as const;
}

type SearchInputProps = {
  search: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
};

/**
 * A controlled search input styled with the app's design tokens.
 * Pair with useSearch() in the parent to get state + URL sync.
 */
export default function SearchInput({
  search,
  onChange,
  placeholder,
  label,
}: SearchInputProps) {
  return (
    <div className="mx-auto max-w-sm">
      <input
        type="search"
        value={search}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="field"
      />
    </div>
  );
}