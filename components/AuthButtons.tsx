"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignInButton() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setIsRedirecting(true);
    setError(null);
    // On success the browser leaves for GitHub, so this only returns
    // when something went wrong before the redirect.
    const result = await authClient.signIn.social({
      provider: "github",
      callbackURL: "/recipes",
      errorCallbackURL: "/login",
    });
    if (result.error) {
      setError("Couldn't start sign-in. Try again.");
      setIsRedirecting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isRedirecting}
        className="btn-primary"
      >
        {isRedirecting ? "Redirecting to GitHub..." : "Sign in with GitHub"}
      </button>
      {error && (
        <p role="alert" className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function SignOutButton({
  className = "btn-quiet",
}: {
  className?: string;
}) {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleClick() {
    setIsSigningOut(true);
    await authClient.signOut();
    // refresh() re-renders the Server Components, so the owner-only
    // buttons disappear right away.
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSigningOut}
      className={className}
    >
      {isSigningOut ? "Signing out..." : "Sign out"}
    </button>
  );
}