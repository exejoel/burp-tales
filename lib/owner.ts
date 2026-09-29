import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Sign-in only succeeds for the owner's GitHub account (see lib/auth.ts),
// so any valid session belongs to the owner. With the stateless setup,
// this reads an encrypted cookie; it doesn't touch the database.
export async function isOwner(): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session !== null;
}

// Call at the top of every Server Action that writes or does anything
// costly. Server Actions are public endpoints: hiding a button doesn't
// stop someone from calling the action directly.
export async function requireOwner(): Promise<void> {
  if (!(await isOwner())) {
    throw new Error("Not authorized");
  }
}
