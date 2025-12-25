/**
 * Seed script untuk membuat test users dengan role berbeda
 * Jalankan dengan: npx tsx src/db/seed.ts
 *
 * Atau jalankan manual via API setelah server running:
 * curl -X POST http://localhost:3000/api/seed
 */

import { db } from "./index";
import { user, account } from "./schema/auth-schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Password sudah di-hash dengan bcrypt (password: password123)
  // Hash ini dibuat dengan bcryptjs.hash("password123", 10)
  const hashedPassword =
    "$2a$10$X4kv7j5ZcG39WgogSl16aurYVx.i/vwfqkV5G.rZ0Dn8xpKNfqK.e";

  const testUsers = [
    {
      id: "admin-test-id",
      name: "Admin Test",
      email: "admin@test.com",
      role: "admin",
    },
    {
      id: "guru-test-id",
      name: "Guru Test",
      email: "guru@test.com",
      role: "guru",
    },
    {
      id: "user-test-id",
      name: "User Test",
      email: "user@test.com",
      role: "user",
    },
  ];

  for (const testUser of testUsers) {
    try {
      // Insert user
      await db
        .insert(user)
        .values({
          id: testUser.id,
          name: testUser.name,
          email: testUser.email,
          emailVerified: true,
          role: testUser.role,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();

      // Insert account dengan password
      await db
        .insert(account)
        .values({
          id: `account-${testUser.id}`,
          accountId: testUser.id,
          providerId: "credential",
          userId: testUser.id,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoNothing();

      console.log(`✅ Created user: ${testUser.email} (${testUser.role})`);
    } catch (_error) {
      console.log(`⚠️ User ${testUser.email} mungkin sudah ada, skip...`);
    }
  }

  console.log("\n📋 Test Users:");
  console.log("┌─────────────────┬──────────────────┬─────────┐");
  console.log("│ Email           │ Password         │ Role    │");
  console.log("├─────────────────┼──────────────────┼─────────┤");
  console.log("│ admin@test.com  │ password123      │ admin   │");
  console.log("│ guru@test.com   │ password123      │ guru    │");
  console.log("│ user@test.com   │ password123      │ user    │");
  console.log("└─────────────────┴──────────────────┴─────────┘");

  console.log("\n🎉 Seeding completed!");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  });
