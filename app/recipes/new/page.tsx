import { redirect } from "next/navigation";
import { isOwner } from "@/lib/owner";
import NewRecipeForm from "@/components/NewRecipeForm";

export const dynamic = "force-dynamic";

export default async function NewRecipePage() {
  const canEdit = await isOwner();

  // Only the owner can add recipes. Everyone else goes to the login page.
  if (!canEdit) redirect("/login");

  return <NewRecipeForm />;
}