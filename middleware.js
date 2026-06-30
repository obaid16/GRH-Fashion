import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Verify only admin paths
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("admin_session")?.value;

    // Redirect to login if trying to access dashboard pages without a session
    if (pathname !== "/admin/login" && !sessionCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect to dashboard if trying to access login page while already logged in
    if (pathname === "/admin/login" && sessionCookie) {
      const dashboardUrl = new URL("/admin/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

// Target all routes inside the /admin path prefix
export const config = {
  matcher: ["/admin/:path*"],
};
