import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, admin, guru, user } from "@/lib/permissions";

// Auto-detect base URL for Vercel deployments (both production and preview)
function getBaseUrl(): string {
  // If explicitly set, use it
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  // Vercel provides this for all deployments (production + preview)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  // Fallback for local development
  return "http://localhost:3000";
}

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: getBaseUrl(),
  plugins: [
    adminClient({
      ac,
      roles: {
        admin,
        guru,
        user,
      },
    }),
  ],
});
