import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// @ts-expect-error - next-intlayer v8 type definitions for middleware are currently broken, but the export exists at runtime
import { intlayerMiddleware } from 'next-intlayer/middleware';
import { Locales } from 'intlayer';

const SUPPORTED_LOCALES = [Locales.ENGLISH, Locales.THAI];
const DEFAULT_LOCALE = Locales.THAI;

function getLocaleFromPathname(pathname: string): string | null {
  const segments = pathname.split('/');
  const candidate = segments[1] as 'en' | 'th';
  return SUPPORTED_LOCALES.includes(candidate) ? candidate : null;
}

// Whitelist public paths (without locale prefix)
const PUBLIC_PATHS = [
  '/auth/',
  '/shop/',
  '/cart',
  '/pre-orders',
  '/privacy-policy',
  '/refund-policy',
  '/shipping-policy',
  '/sales',
];

export default function middleware(request: NextRequest) {
  // 1. Run Intlayer middleware for internationalization
  const intlayerResponse = intlayerMiddleware(request);

  // If intlayer wants to redirect (e.g. adding locale), let it
  if (intlayerResponse.status !== 200) {
    return intlayerResponse;
  }

  const { pathname } = request.nextUrl;
  const locale = getLocaleFromPathname(pathname) || DEFAULT_LOCALE;

  // 2. Check for authentication (Cookie named 'token')
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = !!token;

  // Path without locale prefix
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';

  const isPublic =
    pathnameWithoutLocale === '/' ||
    PUBLIC_PATHS.some((p) => pathnameWithoutLocale.startsWith(p));

  const isAuthPage = pathnameWithoutLocale.includes('/auth/');
  const isLoginPage = pathnameWithoutLocale.includes('/auth/login');

  // Logic from MWIT-LINK Style:
  
  // Keep home as home page for all users
  if (pathnameWithoutLocale === '/') {
    return intlayerResponse;
  }

  // Legacy dashboard path -> new admin path
  if (pathnameWithoutLocale.startsWith('/dashboard')) {
    const nextPath = pathnameWithoutLocale.replace('/dashboard', '/admin');
    return NextResponse.redirect(new URL(`/${locale}${nextPath}`, request.url));
  }

  // Case 2: Protect private routes
  if (!isPublic && !isAuthenticated) {
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    // Optional: add callback URL
    // loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Case 3: Redirect authenticated users away from login page to home
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return intlayerResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|public|__env.js).*)',
  ],
};
