import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    
    // Check if the path starts with /admin or /auth
    const isAdminRoute = path.startsWith('/admin');
    const isAuthRoute = path.startsWith('/auth');
    
    // Get the authentication token
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    // Handle admin routes
    if (isAdminRoute) {
        // If no token exists, redirect to login page with callback URL
        if (!token) {
            const loginUrl = new URL('/auth/login', request.url);
            loginUrl.searchParams.set('callbackUrl', path);
            return NextResponse.redirect(loginUrl);
        }
        // User is authenticated, allow access to admin routes
        return NextResponse.next();
    }

    // Handle auth routes (login, register, etc.)
    if (isAuthRoute) {
        // If user is already authenticated, redirect to admin dashboard
        if (token) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
        // User is not authenticated, allow access to auth routes
        return NextResponse.next();
    }

    // For all other routes, proceed normally
    return NextResponse.next();
}

// Configure middleware to run on both admin and auth routes
export const config = {
    matcher: ['/admin/:path*', '/auth/:path*']
};