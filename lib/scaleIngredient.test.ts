import { describe, it, expect } from "vitest";
import { scaleIngredient } from "./scaleIngredient";

describe("scaleIngredient", () => {
  it("returns unchanged when multiplier is 1", () => {
    expect(scaleIngredient("2 cups flour", 1)).toBe("2 cups flour");
  });

  it("scales whole numbers", () => {
    expect(scaleIngredient("2 cups flour", 2)).toBe("4 cups flour");
  });

  it("scales unicode fractions", () => {
    expect(scaleIngredient("½ tsp salt", 2)).toBe("1 tsp salt");
  });

  it("scales mixed numbers", () => {
    expect(scaleIngredient("1 ½ cups milk", 2)).toBe("3 cups milk");
  });

  it("scales slash fractions", () => {
    expect(scaleIngredient("1/3 cup butter", 3)).toBe("1 cup butter");
  });

  it("leaves text with no number unchanged", () => {
    expect(scaleIngredient("salt to taste", 2)).toBe("salt to taste");
  });

  it("handles empty string", () => {
    expect(scaleIngredient("", 2)).toBe("");
  });

  it("scales down with half multiplier", () => {
    expect(scaleIngredient("4 cups flour", 0.5)).toBe("2 cups flour");
  });

  it("scales decimal amounts", () => {
    expect(scaleIngredient("1.5 cups cream", 2)).toBe("3 cups cream");
  });

  it("handles multi-word remainder", () => {
    expect(scaleIngredient("2 large eggs, beaten", 3)).toBe(
      "6 large eggs, beaten"
    );
  });
});