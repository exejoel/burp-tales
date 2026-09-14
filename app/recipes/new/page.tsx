import { createRecipe } from "../actions";

export default function NewRecipePage() {
  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Add a recipe</h1>
      <form action={createRecipe} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ingredients</label>
          <textarea
            name="ingredients"
            required
            rows={5}
            placeholder="One per line"
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Steps</label>
          <textarea
            name="steps"
            required
            rows={5}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded-md text-sm"
        >
          Save recipe
        </button>
      </form>
    </main>
  );
}
