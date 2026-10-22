import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { isOwner } from "@/lib/owner";

export default async function RestaurantsPage() {
  const canEdit = await isOwner();
  const restaurants = await prisma.restaurant.findMany({
    include: { visits: { orderBy: { date: "desc" }, take: 1 } },
    orderBy: { name: "asc" },
  });
  console.log(canEdit);

  return (
    <main className="max-w-3xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Restaurants</h1>
        {canEdit && (
          <Link
            href="/restaurants/new"
            className="bg-black text-white px-4 py-2 rounded-md text-sm"
          >
          Add visit
        </Link>
        )}
      </div>

      {restaurants.length === 0 ? (
        <p className="text-gray-500">No visits logged yet.</p>
      ) : (
        <ul className="space-y-3">
          {restaurants.map((r) => (
            <li key={r.id} className="border rounded-lg p-4">
              <h2 className="font-medium">{r.name}</h2>
              <p className="text-sm text-gray-500">
                {r.cuisine} {r.city && `· ${r.city}`}
              </p>
              {r.visits[0]?.rating && (
                <p className="text-sm text-gray-500">
                  Latest rating: {r.visits[0].rating}/5
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
