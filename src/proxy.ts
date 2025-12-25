import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const pathname = request.nextUrl.pathname;

  // Redirect to login if not authenticated
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const userRole = session.user?.role || "user";

  // Proteksi route berdasarkan role
  // Admin hanya bisa akses /admin/*
  if (pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(
      new URL(`/${userRole}/dashboard`, request.url)
    );
  }

  // Guru hanya bisa akses /guru/*
  if (pathname.startsWith("/guru") && userRole !== "guru") {
    return NextResponse.redirect(
      new URL(`/${userRole}/dashboard`, request.url)
    );
  }

  // User hanya bisa akses /user/*
  if (pathname.startsWith("/user") && userRole !== "user") {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/guru/:path*", "/user/:path*"],
};
