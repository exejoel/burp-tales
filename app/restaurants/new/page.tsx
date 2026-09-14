import { createRestaurantVisit } from "../actions";

export default function NewVisitPage() {
  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Log a visit</h1>
      <form action={createRestaurantVisit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Restaurant name</label>
          <input name="restaurantName" required className="w-full border rounded-md px-3 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cuisine</label>
            <input name="cuisine" className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input name="city" className="w-full border rounded-md px-3 py-2" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input type="date" name="date" required className="w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
            <input type="number" name="rating" min="1" max="5" className="w-full border rounded-md px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea name="notes" rows={4} className="w-full border rounded-md px-3 py-2" />
        </div>
        <button type="submit" className="bg-black text-white px-4 py-2 rounded-md text-sm">
          Save visit
        </button>
      </form>
    </main>
  );
}
