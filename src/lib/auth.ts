import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, guru, user } from "@/lib/permissions";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin,
        guru,
        user,
      },
      defaultRole: "user", // Role default untuk user baru
    }),
    nextCookies(),
  ],
});
