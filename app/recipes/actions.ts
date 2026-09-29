"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { scrapeRecipeFromUrl } from "@/lib/scrapeRecipe";

// TODO: replace with the real logged-in user once auth is added
const PLACEHOLDER_USER_ID = "cmtxs8n2l0000muiy9ezqjki9";

// What a create or update action sends back to the form when it can't
// save. On success the action redirects instead, so there's no success state.
export type RecipeFormState = {
  fieldErrors?: {
    title?: string;
    ingredients?: string;
    steps?: string;
  };
  formError?: string;
  // What the user submitted, so the form can show it again after an error.
  values?: {
    title: string;
    steps: string;
  };
};

type RecipeFields = {
  title: string;
  ingredients: string;
  steps: string;
};

export async function fetchRecipeFromUrl(url: string) {
  return scrapeRecipeFromUrl(url);
}

// Not exported, so it's a plain helper, not a Server Action the
// browser could call. Shared by create and update.
function readRecipeFields(
  formData: FormData
):
  | { ok: true; fields: RecipeFields }
  | { ok: false; state: RecipeFormState } {
  const rawTitle = String(formData.get("title") ?? "");
  const rawSteps = String(formData.get("steps") ?? "");

  const title = rawTitle.trim();
  const ingredients = String(formData.get("ingredients") ?? "").trim();
  const steps = rawSteps.trim();

  const fieldErrors: NonNullable<RecipeFormState["fieldErrors"]> = {};
  if (!title) fieldErrors.title = "Add a title.";
  if (!ingredients) fieldErrors.ingredients = "Add at least one ingredient.";
  if (!steps) fieldErrors.steps = "Add the steps.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      ok: false,
      state: { fieldErrors, values: { title: rawTitle, steps: rawSteps } },
    };
  }
  return { ok: true, fields: { title, ingredients, steps } };
}

// With useActionState, React calls the action as (previousState, formData).
export async function createRecipe(
  _prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  const result = readRecipeFields(formData);
  if (!result.ok) return result.state;

  const { fields } = result;
  const sourceUrl = String(formData.get("sourceUrl") ?? "");
  const imageUrl = String(formData.get("imageUrl") ?? "");

  try {
    await prisma.recipe.create({
      data: {
        ...fields,
        sourceUrl: sourceUrl || null,
        imageUrl: imageUrl || null,
        userId: PLACEHOLDER_USER_ID,
      },
    });
  } catch (err) {
    console.error("createRecipe failed:", err);
    return {
      formError: "Couldn't save the recipe. Try again.",
      values: { title: fields.title, steps: fields.steps },
    };
  }

  // Outside the try/catch on purpose: redirect() works by throwing a
  // special error, and a catch block would swallow it.
  revalidatePath("/recipes");
  redirect("/recipes");
}

// The edit page binds the id: updateRecipe.bind(null, recipe.id).
// Bound values travel through the browser, so treat `id` like any user
// input: matching on userId too means you can only edit your own recipes.
export async function updateRecipe(
  id: string,
  _prevState: RecipeFormState,
  formData: FormData
): Promise<RecipeFormState> {
  const result = readRecipeFields(formData);
  if (!result.ok) return result.state;

  const { fields } = result;

  try {
    await prisma.recipe.update({
      where: { id, userId: PLACEHOLDER_USER_ID },
      data: fields,
    });
  } catch (err) {
    console.error("updateRecipe failed:", err);
    // P2025 is Prisma's "record not found" code.
    const notFound = (err as { code?: string }).code === "P2025";
    return {
      formError: notFound
        ? "This recipe no longer exists. It may have been deleted."
        : "Couldn't save your changes. Try again.",
      values: { title: fields.title, steps: fields.steps },
    };
  }

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${id}`);
  redirect(`/recipes/${id}`);
}

// Same trust rule as updateRecipe: the id comes from the browser, so
// matching on userId means you can only delete your own recipes.
export async function deleteRecipe(id: string) {
  await prisma.recipe.delete({
    where: { id, userId: PLACEHOLDER_USER_ID },
  });

  revalidatePath("/recipes");
  redirect("/recipes");
}