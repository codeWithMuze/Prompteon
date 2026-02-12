import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, signToken, setAuthCookies } from './lib/auth';

export async function middleware(request: NextRequest) {
    // 1. Check for access token
    const accessToken = request.cookies.get('access_token')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;

    // 2. Define protected routes (if we had separate pages, e.g. /dashboard)
    // Since this is a single-page app primarily, we might just want to protect specific API routes or check session on load.
    // However, let's say we want to prevent access to /api/protected/* if not authenticated.

    // For the main page '/', we allow access but state determines view.
    // But if we wanted to enforce login for the entire app:
    /*
    if (!accessToken && !refreshToken && request.nextUrl.pathname !== '/login') {
       return NextResponse.redirect(new URL('/login', request.url));
    }
    */

    // 3. Token Rotation Logic in Middleware (Optional but powerful)
    // If access token is expired but refresh token is valid, we can refresh here transparently.
    // maximizing "Session Persistence".

    if (!accessToken && refreshToken) {
        // Verify refresh token
        const payload = await verifyToken(refreshToken);
        if (payload) {
            // Create new tokens
            const newAccessToken = await signToken({ id: payload.sub }, '15m');

            // We should ideally rotate refresh token too, but doing it on every request is heavy.
            // Strategy: Rotate refresh token only if it's nearing expiry or just rotate access token here.
            // Let's just issue a new access token for seamless experience.

            const response = NextResponse.next();

            // Set new access token cookie
            response.cookies.set('access_token', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60,
                path: '/'
            });

            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (auth routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
};
