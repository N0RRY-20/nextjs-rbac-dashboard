import { NextRequest, NextResponse } from "next/server";
import { authClient } from "@/lib/auth-client";

export async function proxy(request: NextRequest) {
  const { data: session } = await authClient.getSession();

  // Redirect to login if not authenticated
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"], // Specify the routes the middleware applies to
};
