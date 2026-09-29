import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Handles the GitHub redirect flow, sign-out, and session requests
// under /api/auth/*.
export const { GET, POST } = toNextJsHandler(auth);
