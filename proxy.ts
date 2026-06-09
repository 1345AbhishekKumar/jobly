import { NextResponse, type NextRequest } from "next/server";
import { updateSession, type CookieStore } from "@insforge/sdk/ssr";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/find-jobs");
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  // Create initial response
  const response = NextResponse.next({ request });

  // Update session cookies (refresh access token if needed)
  await updateSession({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
    requestCookies: request.cookies as unknown as CookieStore,
    responseCookies: response.cookies as unknown as CookieStore,
  });

  // Check if we have an access token after session update
  const hasAccessToken =
    response.cookies.has("insforge_access_token") ||
    request.cookies.has("insforge_access_token");

  if (isProtectedRoute && !hasAccessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    
    // Create redirect response but propagate cookies
    const redirectResponse = NextResponse.redirect(loginUrl);
    
    // Copy the updated cookies to redirect response
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    
    return redirectResponse;
  }

  if (isAuthRoute && hasAccessToken) {
    const dashboardUrl = new URL("/dashboard", request.url);
    const redirectResponse = NextResponse.redirect(dashboardUrl);
    
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};
