import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key-change-in-prod-12345';
const key = new TextEncoder().encode(SECRET_KEY);

export async function signToken(payload: any, expiresIn: string = '15m') {
    // Ensure we have a token version, default to 0 if not present
    const tokenPayload = {
        ...payload,
        token_version: payload.token_version || 0
    };

    return await new SignJWT(tokenPayload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(key);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function setAuthCookies(accessToken: string, refreshToken: string) {
    const cookieStore = cookies();

    // Access Token (Short-lived, easier access for client if needed, but here we keep it HTTP-only for max security)
    cookieStore.set('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60, // 15 minutes
        path: '/',
    });

    // Refresh Token (Long-lived)
    cookieStore.set('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
    });
}

export async function clearAuthCookies() {
    const cookieStore = cookies();
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
}

export async function getSession() {
    const cookieStore = cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token) return null;
    return await verifyToken(token);
}
