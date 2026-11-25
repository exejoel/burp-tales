import Link from "next/link";
import { createRestaurantVisit } from "../actions";

export default function NewVisitPage() {
  return (
    <main className="mx-auto w-full max-w-xl px-6 py-14">
      <Link href="/restaurants" className="link-quiet">
        ← All restaurants
      </Link>

      <h1 className="mt-10 mb-10 font-display text-5xl font-medium tracking-tight text-center">
        Log a visit
      </h1>

      <form action={createRestaurantVisit} className="space-y-8">
        <div>
          <label htmlFor="restaurantName" className="label">
            Restaurant name
          </label>
          <input
            id="restaurantName"
            name="restaurantName"
            required
            className="field"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="cuisine" className="label">
              Cuisine
            </label>
            <input id="cuisine" name="cuisine" className="field" />
          </div>
          <div>
            <label htmlFor="city" className="label">
              City
            </label>
            <input id="city" name="city" className="field" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="label">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              className="field"
            />
          </div>
          <div>
            <label htmlFor="rating" className="label">
              Rating (1–5)
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              min="1"
              max="5"
              className="field"
            />
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="label">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="field leading-relaxed"
          />
        </div>

        <div className="border-t border-rule pt-6">
          <button type="submit" className="btn-primary">
            Save visit
          </button>
        </div>
      </form>
    </main>
  );
}
