import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
    // 1. Clear cookies
    await clearAuthCookies();

    // 2. In a real app, invalidate refresh token in DB here

    return NextResponse.json({ success: true });
}
