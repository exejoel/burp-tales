import type { Metadata } from "next";
import Link from "next/link";
import { isOwner } from "@/lib/owner";
import { SignInButton, SignOutButton } from "@/components/AuthButtons";

export const dynamic = "force-dynamic";

// Not linked from anywhere, and hidden from search engines.
export const metadata: Metadata = {
  title: "Sign in · Burp Tales",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, signedIn] = await Promise.all([searchParams, isOwner()]);

  return (
    <main className="mx-auto w-full max-w-sm px-6 py-24 text-center">
      <h1 className="font-display text-4xl font-medium tracking-tight">
        {signedIn ? "You're signed in" : "Owner sign in"}
      </h1>

      {signedIn ? (
        <>
          <p className="mt-3 text-muted">
            You can add, edit, and delete recipes.
          </p>
          <div className="mt-8 flex justify-center gap-2">
            <Link href="/recipes" className="btn-primary">
              Go to recipes
            </Link>
            <SignOutButton />
          </div>
        </>
      ) : (
        <>
          <p className="mt-3 text-muted">
            Editing is limited to the site owner.
          </p>
          {error && (
            <p role="alert" className="mt-6 text-sm text-danger">
              That account can&apos;t sign in here.
            </p>
          )}
          <div className="mt-8 flex justify-center">
            <SignInButton />
          </div>
        </>
      )}
    </main>
  );
}
