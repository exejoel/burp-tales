import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { isOwner } from "@/lib/owner";
import RestaurantList from "@/components/RestaurantList";

export const dynamic = "force-dynamic";

export default async function RestaurantsPage() {
  const canEdit = await isOwner();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-14">
      <header className="mb-10 text-center">
        <h1 className="font-display text-5xl font-medium tracking-tight">
          Restaurants
        </h1>
        {canEdit && (
          <Link href="/restaurants/new" className="btn-primary mt-6">
            Log a visit
          </Link>
        )}
      </header>

      <Suspense fallback={<RestaurantListSkeleton />}>
        <RestaurantListData />
      </Suspense>
    </main>
  );
}

async function RestaurantListData() {
  const rows = await prisma.restaurant.findMany({
    include: { visits: { orderBy: { date: "desc" }, take: 1 } },
    orderBy: { name: "asc" },
  });

  if (rows.length === 0) {
    return (
      <p className="text-center text-muted">No visits logged yet.</p>
    );
  }

  // Select only what the client component needs. Everything passed to a
  // client component is serialized into the page, so smaller is better.
  const restaurants = rows.map((r) => ({
    id: r.id,
    name: r.name,
    cuisine: r.cuisine,
    city: r.city,
    latestRating: r.visits[0]?.rating ?? null,
  }));

  return <RestaurantList restaurants={restaurants} />;
}

function RestaurantListSkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Loading restaurants</span>
      <div className="skeleton mx-auto h-10 max-w-sm" />
      <div className="mt-3 mb-8 h-5" />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <li key={i} className="rounded-2xl border border-rule p-5">
            <div className="skeleton h-6 w-3/4" />
            <div className="skeleton mt-2 h-4 w-1/2" />
          </li>
        ))}
      </ul>
    </div>
  );
}