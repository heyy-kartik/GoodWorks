<<<<<<< HEAD
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
  "/pricing(.*)"
]);



export default clerkMiddleware(async (auth  , req) => {
  if(!isPublicRoute(req)){
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
=======
// src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/sign-in",
  "/sign-up",
  "/_next",      // next internals
  "/static",     // if you serve static files here
  "/favicon.ico",
  "/robots.txt",
];

function isPublic(pathname: string) {
  // allow exact public paths and any path that starts with a public prefix
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p));
}

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // if it's public, let it through
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // OPTIONAL: only protect certain routes (if you prefer whitelist)
  // const protectedList = ["/", "/user", "/dashboard"];
  // if (!protectedList.includes(pathname) && !protectedList.some(p => pathname.startsWith(p + "/"))) {
  //   return NextResponse.next();
  // }

  // For other routes, check session
  const session = await auth();
  if (!session?.userId) {
    // redirect to sign-in and include a redirectUrl query so you can return after sign-in
    const signInUrl = new URL("/sign-in", request.url);
    // include the attempted path so you can redirect back after sign-in
    signInUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  // run middleware for all app routes (you already had a wide matcher - keep similar)
  matcher: [
    '/((?!_next|[^?]*\\.(?:jpg|jpeg|png|gif|webp|avif|svg|ico|css|js|map|json|woff2?|ttf)).*)',
>>>>>>> 99652f9446f7a93231421aeee2130565d6dd3a88
    '/(api|trpc)(.*)',
  ],
};