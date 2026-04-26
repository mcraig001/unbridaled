import { NextRequest, NextResponse } from "next/server";

/**
 * S6/G7: Legal gate middleware.
 * /app routes return "coming soon" unless LEGAL_REVIEW_COMPLETE=true.
 * This gate cannot be bypassed at the middleware level.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/intake") ||
    pathname.startsWith("/results") ||
    pathname.startsWith("/scenarios") ||
    pathname.startsWith("/export");

  if (isAppRoute) {
    const legalGate = process.env.LEGAL_REVIEW_COMPLETE;
    if (legalGate !== "true") {
      return NextResponse.redirect(new URL("/coming-soon", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/intake/:path*",
    "/results/:path*",
    "/scenarios/:path*",
    "/export/:path*",
  ],
};
