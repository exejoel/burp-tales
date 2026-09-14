"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// TODO: replace with the real logged-in user once auth is added (slice 3)
const PLACEHOLDER_USER_ID = "cmtxs8n2l0000muiy9ezqjki9";

export async function createRecipe(formData: FormData) {
  const title = formData.get("title") as string;
  const ingredients = formData.get("ingredients") as string;
  const steps = formData.get("steps") as string;

  if (!title || !ingredients || !steps) {
    throw new Error("Title, ingredients, and steps are required");
  }

  await prisma.recipe.create({
    data: {
      title,
      ingredients,
      steps,
      userId: PLACEHOLDER_USER_ID,
    },
  });

  redirect("/recipes");
}
