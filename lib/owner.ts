import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Sign-in only succeeds for the owner's GitHub account (see lib/auth.ts),
// so any valid session belongs to the owner. With the stateless setup,
// this reads an encrypted cookie; it doesn't touch the database.
export async function isOwner(): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session !== null;
}

// Call at the top of every Server Action that writes data.
// Returns the owner's database user ID, creating the User row on first
// use. This bridges the stateless auth (cookie-only, no user table) with
// Prisma's foreign keys — the row is created once and reused.
export async function requireOwner(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Not authorized");
  }

  const email = session.user.email;

  // Find or create the owner's user row. upsert avoids a race if two
  // actions fire at the same time on the first visit.
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: session.user.name ?? null,
    },
    select: { id: true },
  });

  return user.id;
}