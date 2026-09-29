"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/recipes", label: "Recipes" },
  { href: "/restaurants", label: "Restaurants" },
];

// Client Component only because usePathname needs the browser's URL.
// The rest of the header stays on the server.
export default function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex gap-6">
      {links.map(({ href, label }) => {
        // startsWith, so /recipes/123/edit still highlights "Recipes".
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "text-sm text-ink underline decoration-basil decoration-2 underline-offset-8"
                  : "text-sm text-muted transition-colors hover:text-ink"
              }
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
