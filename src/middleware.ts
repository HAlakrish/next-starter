import { NextResponse } from "next/server";

import createMiddleware from "next-intl/middleware";

import { auth } from "@/auth";
import { canAccessRoute, getDashboardByRole } from "@/utils/role-utils";

// Create the internationalization middleware
const intlMiddleware = createMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
});

export default auth((request) => {
  const pathname = request.nextUrl.pathname;
  const isLoggedIn = !!request.auth;
  const userRole = request.auth?.user?.role;

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];
  const authRoutes = ["/auth/login", "/auth/register"];

  // Check if pathname already contains a locale
  const pathnameHasLocale = ["/en", "/ar"].some(
    (locale) => pathname.startsWith(locale + "/") || pathname === locale
  );

  // Extract the route without locale prefix
  const routeWithoutLocale = pathnameHasLocale
    ? pathname.replace(/^\/[a-z]{2}/, "")
    : pathname;

  // If user is logged in and tries to access auth pages, redirect to role-based dashboard
  if (
    isLoggedIn &&
    authRoutes.some((route) => routeWithoutLocale.startsWith(route))
  ) {
    const locale = pathnameHasLocale ? pathname.split("/")[1] : "en";
    const dashboardRoute = userRole
      ? getDashboardByRole(userRole as any)
      : "/dashboard";
    return NextResponse.redirect(
      new URL(`/${locale}${dashboardRoute}`, request.url)
    );
  }

  // If user is not logged in and tries to access protected routes, redirect to login
  if (
    !isLoggedIn &&
    protectedRoutes.some((route) => routeWithoutLocale.startsWith(route))
  ) {
    const locale = pathnameHasLocale ? pathname.split("/")[1] : "en";
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url));
  }

  // If user is logged in but doesn't have permission for this route
  if (
    isLoggedIn &&
    userRole &&
    protectedRoutes.some((route) => routeWithoutLocale.startsWith(route)) &&
    !canAccessRoute(userRole as any, routeWithoutLocale)
  ) {
    const locale = pathnameHasLocale ? pathname.split("/")[1] : "en";
    const dashboardRoute = getDashboardByRole(userRole as any);
    return NextResponse.redirect(
      new URL(`/${locale}${dashboardRoute}`, request.url)
    );
  }

  // Handle locale redirection for non-auth requests
  if (!pathnameHasLocale) {
    // Let next-intl handle locale detection and cookie management
    return intlMiddleware(request);
  }

  // Use next-intl middleware for requests with locale
  return intlMiddleware(request);
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
