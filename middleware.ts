import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProtectedPage = pathname.startsWith('/dashboard') || pathname.startsWith('/projects');
  const isPublicPage = pathname === '/' || pathname.startsWith('/bulk-analysis');

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware:', {
      pathname,
      isLoggedIn,
      userId: req.auth?.user?.id,
      isAuthPage,
      isProtectedPage,
      isPublicPage,
    });
  }

  // Allow public pages without any redirects
  if (isPublicPage) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users from protected pages
  if (isProtectedPage && !isLoggedIn) {
    console.log('Redirecting to login - protected page accessed without auth');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isLoggedIn) {
    console.log('Redirecting to dashboard - auth page accessed while logged in');
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
