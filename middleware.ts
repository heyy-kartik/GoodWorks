// src/middleware.ts
import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Protect nearly all routes; allow specific public routes (landing, sign-in, sign-up, webhooks).
 *
 * authMiddleware will redirect unauthenticated users to Clerk's sign-in flow by default.
 * We still expose a matcher below so middleware doesn't run for static assets/_next internals.
 */

export default authMiddleware({
  // list any routes you want available to unauthenticated users
  publicRoutes: [
    "/",               // landing page
    "/sign-in*",       // clerk sign-in pages
    "/sign-up*",       // clerk sign-up pages
    "/api/webhooks*",  // example public API (webhooks)
    "/_health",        // optional healthcheck
  ],
});

/**
 * Important: matcher must exclude _next static files and typical asset extensions,
 * otherwise middleware runs for assets and breaks the site.
 *
 * The regex below will match all app routes except:
 *  - /_next/* and /_next/static/*
 *  - public static assets with common extensions (png/jpg/svg/css/js/woff2 etc.)
 *
 * Adjust patterns if you host other public endpoints (like /public/*).
 */
export const config = {
  matcher: [
    // run for everything except Next internals and common static asset types
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:png|jpg|jpeg|webp|svg|gif|css|js|map|woff2?|ttf)).*)',
  ],
};