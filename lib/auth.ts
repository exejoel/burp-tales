import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

// Stateless setup: no `database` option, so Better Auth keeps the session
// in an encrypted cookie instead of a table. There's only one user (you),
// so there's nothing worth storing.
export const auth = betterAuth({
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // stay signed in for 7 days
      strategy: "jwe", // encrypted, not just signed
      refreshCache: true, // extend the 7 days while you keep using the site
    },
  },
  user: {
    // The gate: runs on every GitHub sign-in, before a session exists.
    // Only your GitHub account gets through. If OWNER_GITHUB_ID is missing,
    // nothing matches and everyone is refused, so a config mistake fails
    // closed instead of open.
    validateUserInfo: ({ source }) => {
      const githubId = source.oauth?.profile?.id;
      if (
        source.oauth?.providerId !== "github" ||
        String(githubId) !== process.env.OWNER_GITHUB_ID
      ) {
        return {
          error: "not_owner",
          errorDescription: "Only the site owner can sign in.",
        };
      }
    },
  },
  plugins: [nextCookies()], // must stay last in the list
});
