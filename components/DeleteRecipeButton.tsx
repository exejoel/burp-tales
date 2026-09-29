"use client";

import { useTransition } from "react";
import { deleteRecipe } from "@/app/recipes/actions";

type DeleteRecipeButtonProps = {
  recipeId: string;
  recipeTitle: string;
};

// The only client code on the detail page. confirm() and onClick need the
// browser, so just this button is a Client Component; the page stays on
// the server.
export default function DeleteRecipeButton({
  recipeId,
  recipeTitle,
}: DeleteRecipeButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Delete "${recipeTitle}"? This can't be undone.`)) {
      return;
    }
    // useTransition gives us isPending for a Server Action that isn't
    // attached to a <form>, where useFormStatus wouldn't work.
    startTransition(async () => {
      await deleteRecipe(recipeId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="btn-danger-quiet"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
