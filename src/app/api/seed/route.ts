import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema/auth-schema";
import { eq } from "drizzle-orm";

/**
 * API Route untuk seed test users
 * Akses via: GET /api/seed
 */
export async function GET() {
  try {
    const testUsers = [
      {
        name: "Admin Test",
        email: "admin@test.com",
        password: "password123",
        role: "admin",
      },
      {
        name: "Guru Test",
        email: "guru@test.com",
        password: "password123",
        role: "guru",
      },
      {
        name: "User Test",
        email: "user@test.com",
        password: "password123",
        role: "user",
      },
    ];

    const results = [];

    for (const testUser of testUsers) {
      try {
        // Cek apakah user sudah ada
        const existingUser = await db
          .select()
          .from(user)
          .where(eq(user.email, testUser.email))
          .limit(1);

        if (existingUser.length > 0) {
          // Update role jika user sudah ada
          await db
            .update(user)
            .set({ role: testUser.role })
            .where(eq(user.email, testUser.email));

          results.push({
            email: testUser.email,
            role: testUser.role,
            status: "role updated",
          });
        } else {
          // Buat user baru
          const newUser = await auth.api.signUpEmail({
            body: {
              name: testUser.name,
              email: testUser.email,
              password: testUser.password,
            },
          });

          // Update role setelah user dibuat
          if (newUser?.user?.id) {
            await db
              .update(user)
              .set({ role: testUser.role })
              .where(eq(user.id, newUser.user.id));
          }

          results.push({
            email: testUser.email,
            role: testUser.role,
            status: "created with role",
          });
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        results.push({
          email: testUser.email,
          role: testUser.role,
          status: "error",
          error: errorMessage,
        });
      }
    }

    return NextResponse.json({
      message: "Seed completed",
      users: results,
      credentials: {
        password: "password123",
        note: "Semua test user menggunakan password yang sama",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Seed failed", details: String(error) },
      { status: 500 }
    );
  }
}
