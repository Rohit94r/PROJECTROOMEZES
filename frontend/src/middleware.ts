import { NextRequest, NextResponse } from 'next/server';

// Middleware to handle authentication
export function middleware(request: NextRequest) {
  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/auth'];
  
  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  // Get the token from cookies or localStorage (handled on client side)
  const token = request.cookies.get('token')?.value || null;
  
  // For API routes, we'll handle authentication differently
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // If user is not authenticated and trying to access protected route
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  // If user is authenticated and trying to access auth page, redirect to home
  if (isPublicRoute && token && request.nextUrl.pathname === '/auth') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

// Define which routes the middleware should run for
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};