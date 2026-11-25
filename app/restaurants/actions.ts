"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/owner";

export async function createRestaurantVisit(formData: FormData) {
  const userId = await requireOwner();

  const restaurantName = formData.get("restaurantName") as string;
  const cuisine = formData.get("cuisine") as string;
  const city = formData.get("city") as string;
  const date = formData.get("date") as string;
  const rating = formData.get("rating") as string;
  const notes = formData.get("notes") as string;

  if (!restaurantName || !date) {
    throw new Error("Restaurant name and date are required");
  }

  // Find an existing restaurant with this name, or create a new one
  let restaurant = await prisma.restaurant.findFirst({
    where: { name: restaurantName },
  });

  if (!restaurant) {
    restaurant = await prisma.restaurant.create({
      data: { name: restaurantName, cuisine, city },
    });
  }

  await prisma.visit.create({
    data: {
      userId,
      restaurantId: restaurant.id,
      date: new Date(date),
      rating: rating ? parseInt(rating) : null,
      notes,
    },
  });

  redirect("/restaurants");
}