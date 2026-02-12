import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, signToken, setAuthCookies } from '../../../../lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;

    if (!refreshToken) {
        return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }

    // 1. Verify Refresh Token
    const payload = await verifyToken(refreshToken);

    if (!payload) {
        return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    // 2. In a real DB, check if refresh token is revoked or if user exists
    // For now, we trust the signature and expiry

    // 3. Rotate Refresh Token (Security Best Practice)
    // Create new Access Token
    // Note: We need user details. In a real app, fetch from DB using payload.sub (userId).
    // Here, we'll re-sign based on minimal info or decoded structure if we had it.
    // Since we don't have DB access in this mock context, we'll assuming payload has what we need or just re-issue access token with ID.
    // Ideally, we fetch user from DB. Let's mock fetching user for now or store user data in refresh token (not recommended for large data).

    // For this implementation, we will assume we can get user data or just refresh the session.
    // Let's re-sign with the ID.
    const newAccessToken = await signToken({ id: payload.sub }, '15m');
    const newRefreshToken = await signToken({ sub: payload.sub }, '7d');

    // 4. Set new cookies
    await setAuthCookies(newAccessToken, newRefreshToken);

    return NextResponse.json({ success: true });
}
