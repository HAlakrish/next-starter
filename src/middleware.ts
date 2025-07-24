import { NextRequest, NextResponse } from "next/server";

import createMiddleware from "next-intl/middleware";

// Create the internationalization middleware
const intlMiddleware = createMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "always",
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if pathname already contains a locale
  const pathnameHasLocale = ["/en", "/ar"].some(
    (locale) => pathname.startsWith(locale + "/") || pathname === locale
  );

  // If no locale in pathname, detect and redirect
  if (!pathnameHasLocale) {
    // Get preferred locale from cookie or browser
    const preferredLocale =
      request.cookies.get("preferred-locale")?.value ||
      request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] ||
      "en";

    // Ensure we have a valid locale
    const locale = ["en", "ar"].includes(preferredLocale)
      ? preferredLocale
      : "en";

    // Create response with redirect
    const response = NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );

    // Set the preferred locale cookie
    response.cookies.set("preferred-locale", locale, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  }

  // Use next-intl middleware for requests with locale
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
  ],
};
