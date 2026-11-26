import { describe, it, expect } from "vitest";

type Ingredient = { id: string; text: string };

type Action =
  | { type: "added"; id: string }
  | { type: "changed"; id: string; text: string }
  | { type: "removed"; id: string }
  | { type: "moved"; id: string; direction: "up" | "down" };

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
      const unhandled: never = action;
      return unhandled;
    }
  }
}

// --- Tests ---

const seed: Ingredient[] = [
  { id: "1", text: "2 cups flour" },
  { id: "2", text: "1 tsp salt" },
  { id: "3", text: "3 eggs" },
];

describe("ingredientsReducer", () => {
  it("adds an empty ingredient at the end", () => {
    const next = ingredientsReducer(seed, { type: "added", id: "4" });
    expect(next).toHaveLength(4);
    expect(next[3]).toEqual({ id: "4", text: "" });
  });

  it("does not mutate the original array on add", () => {
    const before = [...seed];
    ingredientsReducer(seed, { type: "added", id: "4" });
    expect(seed).toEqual(before);
  });

  it("changes the text of a specific ingredient", () => {
    const next = ingredientsReducer(seed, {
      type: "changed",
      id: "2",
      text: "2 tsp salt",
    });
    expect(next[1].text).toBe("2 tsp salt");
    expect(next[0]).toEqual(seed[0]); // others unchanged
  });

  it("removes an ingredient by id", () => {
    const next = ingredientsReducer(seed, { type: "removed", id: "2" });
    expect(next).toHaveLength(2);
    expect(next.map((i) => i.id)).toEqual(["1", "3"]);
  });

  it("moves an ingredient up", () => {
    const next = ingredientsReducer(seed, {
      type: "moved",
      id: "2",
      direction: "up",
    });
    expect(next.map((i) => i.id)).toEqual(["2", "1", "3"]);
  });

  it("moves an ingredient down", () => {
    const next = ingredientsReducer(seed, {
      type: "moved",
      id: "2",
      direction: "down",
    });
    expect(next.map((i) => i.id)).toEqual(["1", "3", "2"]);
  });

  it("ignores move up on the first item", () => {
    const next = ingredientsReducer(seed, {
      type: "moved",
      id: "1",
      direction: "up",
    });
    expect(next).toBe(seed); // same reference — no-op
  });

  it("ignores move down on the last item", () => {
    const next = ingredientsReducer(seed, {
      type: "moved",
      id: "3",
      direction: "down",
    });
    expect(next).toBe(seed);
  });

  it("ignores move for unknown id", () => {
    const next = ingredientsReducer(seed, {
      type: "moved",
      id: "unknown",
      direction: "up",
    });
    expect(next).toBe(seed);
  });
});
