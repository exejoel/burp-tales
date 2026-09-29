"use client";

import { useReducer } from "react";

type Ingredient = {
  id: string;
  text: string;
};

type Action =
  | { type: "added"; id: string }
  | { type: "changed"; id: string; text: string }
  | { type: "removed"; id: string }
  | { type: "moved"; id: string; direction: "up" | "down" };

type IngredientEditorProps = {
  // Used only to seed the list when the editor first mounts.
  // To load new ingredients later, the parent changes this component's `key`.
  initialIngredients?: string[];
};

// ---------- Reducer ----------
// A pure function: (current state, action) => next state.
// No side effects here: no fetches, no random IDs, no mutation.

function ingredientsReducer(state: Ingredient[], action: Action): Ingredient[] {
  switch (action.type) {
    case "added":
      return [...state, { id: action.id, text: "" }];

    case "changed":
      return state.map((item) =>
        item.id === action.id ? { ...item, text: action.text } : item
      );

    case "removed":
      return state.filter((item) => item.id !== action.id);

    case "moved": {
      const index = state.findIndex((item) => item.id === action.id);
      const target = action.direction === "up" ? index - 1 : index + 1;
      if (index === -1 || target < 0 || target >= state.length) return state;

      const next = [...state];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    }

    default: {
      // Exhaustiveness check: if you add a new action type and forget
      // to handle it above, this line becomes a type error.
      const unhandled: never = action;
      return unhandled;
    }
  }
}

// Lazy initializer: runs once, on the first render only.
// Fixed IDs (not random ones) keep the server and browser renders identical.
function createInitialState(initialIngredients: string[]): Ingredient[] {
  if (initialIngredients.length === 0) {
    return [{ id: "initial-0", text: "" }];
  }
  return initialIngredients.map((text, i) => ({ id: `initial-${i}`, text }));
}

// ---------- Component ----------

export default function IngredientEditor({
  initialIngredients = [],
}: IngredientEditorProps) {
  const [ingredients, dispatch] = useReducer(
    ingredientsReducer,
    initialIngredients,
    createInitialState
  );

  // Derived state: computed from `ingredients` on every render,
  // never stored separately, so it can never get out of sync.
  const serialized = ingredients
    .map((item) => item.text.trim())
    .filter(Boolean)
    .join("\n");

  return (
    <fieldset>
      <legend className="label">Ingredients</legend>

      {/* This is what the form actually submits, in the same
          newline-separated format your server action already expects. */}
      <input type="hidden" name="ingredients" value={serialized} />

      <ul className="space-y-2">
        {ingredients.map((item, index) => (
          <li key={item.id} className="flex items-center gap-1">
            <input
              type="text"
              value={item.text}
              onChange={(e) =>
                dispatch({ type: "changed", id: item.id, text: e.target.value })
              }
              placeholder="e.g. 2 cups flour"
              aria-label={`Ingredient ${index + 1}`}
              className="field min-w-0 flex-1 mr-1"
            />

            {/* type="button" matters: the default inside a form is
                "submit", which would submit the form on every click. */}
            <button
              type="button"
              onClick={() =>
                dispatch({ type: "moved", id: item.id, direction: "up" })
              }
              disabled={index === 0}
              aria-label={`Move ingredient ${index + 1} up`}
              className="btn-icon"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() =>
                dispatch({ type: "moved", id: item.id, direction: "down" })
              }
              disabled={index === ingredients.length - 1}
              aria-label={`Move ingredient ${index + 1} down`}
              className="btn-icon"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "removed", id: item.id })}
              disabled={ingredients.length === 1}
              aria-label={`Remove ingredient ${index + 1}`}
              className="btn-icon"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        // The ID is created here, in the event handler, not inside the
        // reducer, which keeps the reducer pure.
        onClick={() => dispatch({ type: "added", id: crypto.randomUUID() })}
        className="btn-quiet mt-3"
      >
        Add ingredient
      </button>
    </fieldset>
  );
}
