"use client";

import { useState } from "react";
import { scaleIngredient } from "@/lib/scaleIngredient";

export default function ScaleIngredients({ ingredients }: { ingredients: string[] }) {
    const [multiplier, setMultiplier] = useState(1);
    
    return (
    <>
        {[0.5, 1, 2, 3].map((value) => (
            <button
            key={value}
            onClick={() => setMultiplier(value)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition
                ${multiplier === value
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
            >
            {value === 0.5 ? "½" : value}×
            </button>
        ))}
        <ul className="border-t border-rule">
        {ingredients.map((ingredient, index) => (
            <li key={index} className="border-b border-rule py-2.5">
            {scaleIngredient(ingredient, multiplier)}
            </li>
        ))}
        </ul>
    </>
    );
}