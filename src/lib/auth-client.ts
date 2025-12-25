import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, admin, guru, user } from "@/lib/permissions";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
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
