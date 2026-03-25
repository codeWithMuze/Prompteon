import { NextRequest, NextResponse } from 'next/server';
import { signToken, setAuthCookies } from '../../../../lib/auth';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        // 1. Create account with Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        if (!data.user) {
            return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });
        }

        // 2. Generate our own secure tokens
        const user = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || null,
            plan: data.user.user_metadata?.plan || 'free',
        };

        // Sign Access Token (15m)
        const accessToken = await signToken(user, '15m');

        // Sign Refresh Token (7d)
        const refreshToken = await signToken({ sub: user.id }, '7d');

        // 3. Set HTTP-only cookies
        await setAuthCookies(accessToken, refreshToken);

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error during signup' }, { status: 500 });
    }
}
